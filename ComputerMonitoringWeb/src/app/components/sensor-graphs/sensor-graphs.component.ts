import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartType, ChartData, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-sensor-graphs',
  templateUrl: './sensor-graphs.component.html',
  styleUrls: ['./sensor-graphs.component.scss'],
  standalone: true,
  imports: [CommonModule, NgChartsModule]
})
export class SensorGraphsComponent implements OnInit, OnChanges {
  @Input() pointId!: number;
  @Input() sensorType!: string;
  @Input() parameter!: string;
  @Input() sensorData: any[] = [];

  public lineChartData: any;

  constructor() {}

  ngOnInit(): void {
    this.loadGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensorData'] || changes['parameter']) {
      this.loadGraph();
    }
  }

  loadGraph(): void {
    const chartLabels = this.sensorData.map(entry => this.formatDate(new Date(entry.date)));
    const chartData = this.sensorData.map(entry => entry[this.parameter]);

    this.lineChartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartData,
          label: this.parameter,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.1
        }
      ]
    };
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
}