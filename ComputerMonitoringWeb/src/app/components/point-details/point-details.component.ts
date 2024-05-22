import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Point } from '../../../models/point';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss']
})
export class PointDetailsComponent implements OnInit {
  pointId: number = -1;
  pointTitle: string = "";
  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pointId = +params['id'];
      this.loadPointDetails();
    });
  }

  private loadPointDetails(): void {
    this.http.get<Point>(this.apiUrl +  `/points/${this.pointId}`).subscribe(point => {
      this.pointTitle = point.title;
    });
  }
}