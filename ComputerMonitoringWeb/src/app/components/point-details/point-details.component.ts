import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Point } from '../../../models/point';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaterStat } from '../../../models/water_stat'; // Import the model

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

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

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
    this.http.post<WaterStat>(this.apiUrl + '/water_stats', waterStat).subscribe(response => {
      console.log('Water stat saved:', response);
    });
  }

  // Add similar methods for other sensor types
}