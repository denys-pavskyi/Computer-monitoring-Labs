import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Point } from '../../../models/point';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorGraphsComponent } from '../sensor-graphs/sensor-graphs.component';

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SensorGraphsComponent]
})
export class PointDetailsComponent implements OnInit {
  pointId: number = -1;
  pointTitle: string = "";
  private apiUrl = environment.apiUrl;
  selectedSensorType: string = "";
  selectedParameter: string = "";
  sensorTypes: string[] = [
    'Стан повітря',
    'Стан водних ресурсів',
    'Стан ґрунтів',
    'Рівень радіації',
    'Відходи',
    'Економічний стан',
    'Стан здоров’я населення'
  ];
  sensorParameters: { [key: string]: string[] } = {
    'Стан повітря': ['dust', 'no2', 'so2', 'co2'],
    'Стан водних ресурсів': ['epSecurity', 'sanChem', 'radiation'],
    'Стан ґрунтів': ['humus', 'p2o5', 'k20', 'salinity'],
    'Рівень радіації': ['shortDecay', 'mediumDecay', 'air', 'water'],
    'Відходи': ['paper', 'plastic', 'metal', 'product'],
    'Економічний стан': ['gdp', 'freightTraffic', 'passengerTraffic', 'exportGoods'],
    'Стан здоров’я населення': ['medicalDemographic', 'morbidity', 'disability', 'physicalDevelopment']
  };
  existingSensor: any = null;
  parameters: string[] = [];
  sensorData: any[] = [];
  newSensorData: any = {};
  showGraph: boolean = false;
  useCurrentDate: boolean = false;
  streetName: string = '';
  classification: { class: string, index: number } | null = null;

  private classificationEndpoints: { [key: string]: string } = {
    'Стан повітря': 'airstat',
    'Стан водних ресурсів': 'waterstat',
    'Стан ґрунтів': 'soilstat',
    'Рівень радіації': 'radiationstat',
    'Відходи': 'waste',
    'Економічний стан': 'economystat',
    'Стан здоров’я населення': 'healthstat'
  };

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pointId = +params['id'];
      this.selectedSensorType = 'Стан повітря'; // Set default sensor type if needed
      this.loadPointDetails();
    });
  }

  private loadPointDetails(): void {
    this.http.get<Point>(this.apiUrl + `/points/${this.pointId}`).subscribe(point => {
      this.pointTitle = point.title;
      this.getStreetName(point.cord1, point.cord2).then(street => {
        this.streetName = street;
      });
      this.fetchClassification(point.id!).then(classification => {
        this.classification = classification;
      });
    });
  }

  private async fetchClassification(pointId: number): Promise<{ class: string, index: number }> {
    const classificationType = this.classificationEndpoints[this.selectedSensorType];
    if (!classificationType) {
      return { class: 'Unknown', index: 0 };
    }
    const url = `${this.apiUrl}/points/${pointId}/${classificationType}/classification`;
    try {
      const response = await this.http.get<{ class: string, index: number }>(url).toPromise();
      return response || { class: 'Unknown', index: 0 }; // Default fallback value
    } catch (error) {
      return { class: 'Unknown', index: 0 }; // Handle error by returning a default value
    }
  }

  private getStreetName(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=uk`;
    return this.http.get<any>(url).toPromise().then(response => {
      const address = response.address;
      const road = address.road || address.display_name || 'Unknown street';
      const houseNumber = address.house_number || '';
      return houseNumber ? `${road}, ${houseNumber}` : road;
    }).catch(() => 'Unknown street');
  }

  checkExistingSensor(): void {
    if (this.selectedSensorType in this.sensorParameters) {
      const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType);
      this.parameters = this.sensorParameters[this.selectedSensorType];
      this.http.get<any[]>(this.apiUrl + sensorEndpoint).subscribe(response => {
        this.sensorData = response.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.existingSensor = response.length > 0;
        this.initializeNewSensorData();
        
        // Fetch and update the classification whenever a new sensor type is selected
        this.fetchClassification(this.pointId).then(classification => {
          this.classification = classification;
        });
      }, error => {
        this.existingSensor = false;
      });
    } else {
      console.error('Unknown sensor type');
    }
  }

  initializeNewSensorData(): void {
    const latestData = this.sensorData.length > 0 ? this.sensorData[0] : {};
    this.newSensorData = { ...latestData };
    this.parameters.forEach(param => {
      if (!this.newSensorData[param]) {
        this.newSensorData[param] = 0;
      }
    });
  }

  updateSensorData(): void {
    const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType);
    this.newSensorData['point_id'] = this.pointId;
  
    if (!this.useCurrentDate && this.newSensorData['date']) {
      const date = new Date(this.newSensorData['date']);
      this.newSensorData['date'] = date.toISOString().slice(0, 19); // Remove milliseconds and timezone
    } else {
      delete this.newSensorData['date'];
    }
  
    this.http.post<any>(this.apiUrl + sensorEndpoint, this.newSensorData).subscribe(response => {
      console.log(`${this.selectedSensorType} data updated:`, response);
      this.sensorData.unshift(response);
      this.sensorData = this.sensorData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.initializeNewSensorData();
      
      if(this.showGraph) {
        this.reloadSensorGraphs();
      }
  
      // Fetch and update the classification after updating the sensor data
      this.fetchClassification(this.pointId).then(classification => {
        this.classification = classification;
      });
    });
  }

  deleteRecord(recordId: number): void {
    const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType);
    this.http.delete(`${this.apiUrl + sensorEndpoint}/${recordId}`).subscribe(response => {
      console.log(`Record deleted:`, response);
      this.sensorData = this.sensorData.filter(data => data.id !== recordId);
      if(this.showGraph) {
        this.reloadSensorGraphs();
      }
    });
  }

  reloadSensorGraphs(): void {
    this.showGraph = false;
    setTimeout(() => {
      this.showGraph = true;
    }, 100);
  }

  goBackToMap(): void {
    this.router.navigate(['/']);
  }

  private getSensorEndpoint(sensorType: string): string {
    switch (sensorType) {
      case 'Стан повітря':
        return `/points/${this.pointId}/airstat`;
      case 'Стан водних ресурсів':
        return `/points/${this.pointId}/waterstat`;
      case 'Стан ґрунтів':
        return `/points/${this.pointId}/soilstat`;
      case 'Рівень радіації':
        return `/points/${this.pointId}/radiationstat`;
      case 'Відходи':
        return `/points/${this.pointId}/waste`;
      case 'Економічний стан':
        return `/points/${this.pointId}/economystat`;
      case 'Стан здоров’я населення':
        return `/points/${this.pointId}/healthstat`;
      default:
        return '';
    }
  }

  showSensorGraph(parameter: string): void {
    this.selectedParameter = parameter;
    this.showGraph = true;
  }

  getSortedSensorDataForGraph(): any[] {
    return this.sensorData.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getClassificationColor(classification: string): string {
    switch (classification) {
      case 'Дуже добре':
        return 'green';
      case 'Добре':
        return 'lightgreen';
      case 'Середній':
        return 'yellow';
      case 'Поганий':
        return 'orange';
      case 'Дуже поганий':
        return 'red';
      default:
        return 'grey';
    }
  }
  
  getTextColor(classification: string): string {
    switch (classification) {
      case 'Добре':
      case 'Середній':
        return '#000';
      default:
        return '#fff';
    }
  }
}