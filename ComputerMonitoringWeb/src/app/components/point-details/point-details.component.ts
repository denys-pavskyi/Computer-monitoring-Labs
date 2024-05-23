import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Point } from '../../../models/point';
import { WaterStat } from '../../../models/water_stat';
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
    switch (this.selectedSensorType) {
      case 'Стан водних ресурсів':
        this.saveWaterStat();
        break;
      // Add cases for other sensor types
      default:
        console.error('Unknown sensor type');
    }
  }

  private saveWaterStat(): void {
    const waterStat = new WaterStat(this.pointId);
    this.http.post<WaterStat>(this.apiUrl + `/points/${this.pointId}/waterstat`, waterStat).subscribe(response => {
      console.log('Water stat saved:', response);
      this.existingSensor = response;
      this.parameters = ['epSecurity', 'sanChem', 'radiation'];
    });
  }

  checkExistingSensor(): void {
    switch (this.selectedSensorType) {
      case 'Стан водних ресурсів':
        this.http.get<WaterStat>(this.apiUrl + `/points/${this.pointId}/waterstat`).subscribe(response => {
          this.existingSensor = response;
          this.parameters = ['epSecurity', 'sanChem', 'radiation'];
        }, error => {
          this.existingSensor = null;
        });
        break;
      // Add cases for other sensor types
      default:
        console.error('Unknown sensor type');
    }
  }

  saveParameter(): void {
    if (!this.selectedParameter) return;

    const url = this.apiUrl + `/points/${this.pointId}/waterstat/${this.existingSensor.id}`;
    this.http.put(url, this.existingSensor).subscribe(response => {
      console.log(`${this.selectedParameter} updated:`, response);
    });
  }

  deleteParameter(): void {
    if (!this.selectedParameter) return;

    this.existingSensor[this.selectedParameter] = 0; // Set value back to default
    const url = this.apiUrl + `/points/${this.pointId}/waterstat/${this.existingSensor.id}`;

    this.http.put(url, this.existingSensor).subscribe(response => {
      console.log(`${this.selectedParameter} reset to default:`, response);
    });
  }

  deleteSensor(): void {
    const url = this.apiUrl + `/points/${this.pointId}/waterstat/${this.existingSensor.id}`;
    this.http.delete(url).subscribe(() => {
      console.log('Sensor deleted');
      this.existingSensor = null;
    });
  }

  goBackToMap(): void {
    this.router.navigate(['/']);
  }
}