import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sensor-graphs',
  templateUrl: './sensor-graphs.component.html',
  styleUrls: ['./sensor-graphs.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SensorGraphsComponent implements OnInit, OnChanges {
  @Input() pointId!: number;
  @Input() sensorType!: string;
  @Input() parameter!: string;
  @Input() sensorData: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensorData']) {
      this.loadGraph();
    }
  }

  loadGraph(): void {
    // Implement graph loading logic here based on pointId, sensorType, parameter, and sensorData
    console.log(`Loading graph for point: ${this.pointId}, sensor: ${this.sensorType}, parameter: ${this.parameter}`);
    console.log(`Sensor Data:`, this.sensorData);
  }
}