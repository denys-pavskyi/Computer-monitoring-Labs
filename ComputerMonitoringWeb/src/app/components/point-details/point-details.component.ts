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

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pointId = +params['id'];
      this.loadPointDetails();
    });
  }

  private loadPointDetails(): void {
    this.http.get<Point>(this.apiUrl + `/points/${this.pointId}`).subscribe(point => {
      this.pointTitle = point.title;
    });
  }

  checkExistingSensor(): void {
    if (this.selectedSensorType in this.sensorParameters) {
      const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType);
      this.parameters = this.sensorParameters[this.selectedSensorType];
      this.http.get<any[]>(this.apiUrl + sensorEndpoint).subscribe(response => {
        this.sensorData = response;
        this.existingSensor = response.length > 0;
        this.initializeNewSensorData();
      }, error => {
        this.existingSensor = false;
      });
    } else {
      console.error('Unknown sensor type');
    }
  }

  initializeNewSensorData(): void {
    const latestData = this.sensorData.length > 0 ? this.sensorData[this.sensorData.length - 1] : {};
    this.newSensorData = { date: '', ...latestData };
    this.parameters.forEach(param => {
      if (!this.newSensorData[param]) {
        this.newSensorData[param] = 0;
      }
    });
  }

  updateSensorData(): void {
    if (!this.newSensorData['date']) return;

    const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType);
    this.newSensorData['point_id'] = this.pointId;

    this.http.post<any>(this.apiUrl + sensorEndpoint, this.newSensorData).subscribe(response => {
      console.log(`${this.selectedSensorType} data updated:`, response);
      this.sensorData.push(response);
      this.initializeNewSensorData();
      this.reloadSensorGraphs();
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
}