import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Point } from '../../../models/point';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: any;
  markers: L.Marker[] = [];
  customIcon: L.Icon | any;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
    this.initCustomIcon();
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

  private onMapClick(e: any): void {
    const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: this.customIcon }).addTo(this.map);
    marker.bindPopup(this.createPopupContent(marker)).openPopup();
    this.markers.push(marker);
  }

  private initCustomIcon(): void {
    this.customIcon = L.icon({
      iconUrl: '/assets/free-icon-map-location-5092916.png',
      iconSize: [45, 45],
      iconAnchor: [22.5, 45],
      popupAnchor: [0, -45]
    });
  }

  private createPopupContent(marker: L.Marker): HTMLElement {
    const div = L.DomUtil.create('div', 'popup-content');
    const title = L.DomUtil.create('h4', '', div);
    title.innerHTML = 'New marker';

    const deleteButton = L.DomUtil.create('button', 'delete-button', div);
    deleteButton.innerHTML = 'Видалити';
    deleteButton.onclick = () => {
      this.removeMarker(marker);
      this.map.closePopup();
    };

    const detailsButton = L.DomUtil.create('button', 'details-button', div);
    detailsButton.innerHTML = 'Детальніше';
    detailsButton.onclick = () => {
      alert('More details about this marker');
    };

    return div;
  }

  private removeMarker(marker: L.Marker): void {
    this.map.removeLayer(marker);
    const index = this.markers.indexOf(marker);
    if (index > -1) {
      this.markers.splice(index, 1);
    }
  }
}