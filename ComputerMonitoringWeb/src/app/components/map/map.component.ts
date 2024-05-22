import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Point } from '../../../models/point';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: any;
  markers: L.Marker[] = [];
  customIcon: L.Icon | any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.initMap();
    this.initCustomIcon();
    this.loadPoints();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [50.4, 30.5], // Center on Kyiv, Ukraine
      zoom: 9
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
  }

  private initCustomIcon(): void {
    this.customIcon = L.icon({
      iconUrl: '/assets/free-icon-map-location-5092916.png',
      iconSize: [45, 45],
      iconAnchor: [22.5, 45],
      popupAnchor: [0, -45]
    });
  }

  private loadPoints(): void {
    this.http.get<Point[]>('http://127.0.0.1:5000/points').subscribe(points => {
      points.forEach(point => {
        const marker = L.marker([point.cord1, point.cord2], { icon: this.customIcon }).addTo(this.map);
        marker.bindPopup(this.createExistingPopupContent(marker, point)).openPopup();
        this.markers.push(marker);
      });
    });
  }

  private onMapClick(e: any): void {
    const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: this.customIcon }).addTo(this.map);
    marker.bindPopup(this.createNewPopupContent(marker)).openPopup();
    this.markers.push(marker);
  }

  private createNewPopupContent(marker: L.Marker): HTMLElement {
    const div = L.DomUtil.create('div', 'popup-content');
    const titleInput = L.DomUtil.create('input', 'title-input', div);
    titleInput.type = 'text';
    titleInput.placeholder = 'Enter title';

    const saveButton = L.DomUtil.create('button', 'save-button', div);
    const saveIcon = L.DomUtil.create('img', 'save-icon', saveButton);
    saveIcon.src = 'assets/diskette-icon.png';
    saveIcon.alt = 'Save';
    saveIcon.style.width = '16px';
    saveIcon.style.height = '16px';
    saveButton.appendChild(saveIcon);
    saveButton.innerHTML += ' Save';
    saveButton.onclick = () => {
      this.saveMarkerData(marker, titleInput.value);
      this.map.closePopup();
    };

    const deleteButton = L.DomUtil.create('button', 'delete-button', div);
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = () => {
      this.removeMarker(marker);
      this.map.closePopup();
    };

    return div;
  }

  private createExistingPopupContent(marker: L.Marker, point: Point): HTMLElement {
    const div = L.DomUtil.create('div', 'popup-content');
    const title = L.DomUtil.create('h4', '', div);
    title.innerHTML = point.title;

    const deleteButton = L.DomUtil.create('button', 'delete-button', div);
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = () => {
      this.removeMarker(marker);
      if(point.id != undefined){
        this.deletePoint(point.id);
      }
      this.map.closePopup();
    };

    const detailsButton = L.DomUtil.create('button', 'details-button', div);
    detailsButton.innerHTML = 'Детальніше';
    detailsButton.onclick = () => {
      this.router.navigate(['/point-details', point.id]);
    };

    return div;
  }

  private saveMarkerData(marker: L.Marker, title: string): void {
    const point: Point = {
      title: title,
      cord1: marker.getLatLng().lat,
      cord2: marker.getLatLng().lng
    };

    this.http.post<Point>('/points', point).subscribe(savedPoint => {
      marker.bindPopup(this.createExistingPopupContent(marker, savedPoint)).openPopup();
    });
  }

  private removeMarker(marker: L.Marker): void {
    this.map.removeLayer(marker);
    const index = this.markers.indexOf(marker);
    if (index > -1) {
      this.markers.splice(index, 1);
    }
  }

  private deletePoint(id: number): void {
    this.http.delete(`/points/${id}`).subscribe(() => {
      console.log(`Point with id ${id} deleted`);
    });
  }
}