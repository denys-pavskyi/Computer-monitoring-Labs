import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Point } from '../../../models/point';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PointDetailsComponent implements OnInit {
  pointId: number = -1;
  pointTitle: string = "";
  private apiUrl = environment.apiUrl;
  selectedSensorType: string = "";
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
    'Стан повітря': ['dust', 'no2', 'so2', 'co2', 'pb', 'bens'],
    'Стан водних ресурсів': ['epSecurity', 'sanChem', 'radiation'],
    'Стан ґрунтів': ['humus', 'p2o5', 'k20', 'salinity', 'chemPoll', 'pH'],
    'Рівень радіації': ['shortDecay', 'mediumDecay', 'air', 'water'],
    'Відходи': ['shortDecay', 'mediumDecay', 'air', 'water'],
    'Економічний стан': ['gdp', 'freightTraffic', 'passengerTraffic', 'exportGoods', 'importGoods', 'wages'],
    'Стан здоров’я населення': ['medicalDemographic', 'morbidity', 'disability', 'physicalDevelopment']
  };
  existingSensor: any = null;
  selectedParameter: string = "";
  parameters: string[] = [];

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

  saveSensorData(): void {
    if (this.selectedSensorType in this.sensorParameters) {
      const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType);
      const newSensor = this.createSensorModel(this.selectedSensorType, this.pointId);
      this.http.post(this.apiUrl + sensorEndpoint, newSensor).subscribe(response => {
        console.log(`${this.selectedSensorType} saved:`, response);
        this.existingSensor = response;
        this.parameters = this.sensorParameters[this.selectedSensorType];
      });
    } else {
      console.error('Unknown sensor type');
    }
  }

  checkExistingSensor(): void {
    if (this.selectedSensorType in this.sensorParameters) {
      const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType);
      this.http.get(this.apiUrl + sensorEndpoint).subscribe(response => {
        this.existingSensor = response;
        this.parameters = this.sensorParameters[this.selectedSensorType];
      }, error => {
        this.existingSensor = null;
      });
    } else {
      console.error('Unknown sensor type');
    }
  }

  saveParameter(): void {
    if (!this.selectedParameter || !this.existingSensor) return;
    console.log(this.existingSensor.id);
    const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType, this.existingSensor.id);
    this.http.put(this.apiUrl + sensorEndpoint, this.existingSensor).subscribe(response => {
      console.log(`${this.selectedParameter} updated:`, response);
    });
  }

  deleteParameter(): void {
    if (!this.selectedParameter || !this.existingSensor) return;

    this.existingSensor[this.selectedParameter] = 0; // Set value back to default
    const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType, this.existingSensor.id);

    this.http.put(this.apiUrl + sensorEndpoint, this.existingSensor).subscribe(response => {
      console.log(`${this.selectedParameter} reset to default:`, response);
      this.selectedParameter = ''; // Close the parameter editing section
    });
  }

  deleteSensor(): void {
    if (!this.existingSensor) return;

    const sensorEndpoint = this.getSensorEndpoint(this.selectedSensorType, this.existingSensor.id);
    this.http.delete(this.apiUrl + sensorEndpoint).subscribe(() => {
      console.log('Sensor deleted');
      this.existingSensor = null;
    });
  }

  goBackToMap(): void {
    this.router.navigate(['/']);
  }

  private getSensorEndpoint(sensorType: string, sensorId?: number): string {
    switch (sensorType) {
      case 'Стан повітря':
        return `/points/${this.pointId}/airstat${sensorId ? `/${sensorId}` : ''}`;
      case 'Стан водних ресурсів':
        return `/points/${this.pointId}/waterstat${sensorId ? `/${sensorId}` : ''}`;
      case 'Стан ґрунтів':
        return `/points/${this.pointId}/soilstat${sensorId ? `/${sensorId}` : ''}`;
      case 'Рівень радіації':
        return `/points/${this.pointId}/radiationstat${sensorId ? `/${sensorId}` : ''}`;
      case 'Відходи':
        return `/points/${this.pointId}/waste${sensorId ? `/${sensorId}` : ''}`;
      case 'Економічний стан':
        return `/points/${this.pointId}/economystat${sensorId ? `/${sensorId}` : ''}`;
      case 'Стан здоров’я населення':
        return `/points/${this.pointId}/healthstat${sensorId ? `/${sensorId}` : ''}`;
      default:
        return '';
    }
  }

  private createSensorModel(sensorType: string, pointId: number): any {
    switch (sensorType) {
      case 'Стан повітря':
        return { point_id: pointId, dust: 0, no2: 0, so2: 0, co2: 0, pb: 0, bens: 0 };
      case 'Стан водних ресурсів':
        return { point_id: pointId, epSecurity: 0, sanChem: 0, radiation: 0 };
      case 'Стан ґрунтів':
        return { point_id: pointId, humus: 0, p2o5: 0, k20: 0, salinity: 0, chemPoll: 0, pH: 0 };
      case 'Рівень радіації':
        return { point_id: pointId, shortDecay: 0, mediumDecay: 0, air: 0, water: 0 };
      case 'Відходи':
        return { point_id: pointId, shortDecay: 0, mediumDecay: 0, air: 0, water: 0 };
      case 'Економічний стан':
        return { point_id: pointId, gdp: 0, freightTraffic: 0, passengerTraffic: 0, exportGoods: 0, importGoods: 0, wages: 0 };
      case 'Стан здоров’я населення':
        return { point_id: pointId, medicalDemographic: 0, morbidity: 0, disability: 0, physicalDevelopment: 0 };
      default:
        return {};
    }
  }
}