import { Component, OnInit} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: any;
  markers: L.Marker[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initMap();
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
    const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
    marker.bindPopup(this.createPopupContent(marker)).openPopup();
    this.markers.push(marker);
  }

  private createPopupContent(marker: L.Marker): HTMLElement {
    const div = L.DomUtil.create('div', 'popup-content');
    const title = L.DomUtil.create('h4', '', div);
    title.innerHTML = 'New marker';

    const deleteButton = L.DomUtil.create('button', '', div);
    deleteButton.innerHTML = 'Видалити';
    deleteButton.style.margin = '5px 5px 0 0';
    deleteButton.style.padding = '5px 10px';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '3px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.backgroundColor = '#e74c3c';
    deleteButton.style.color = 'white';
    deleteButton.onclick = () => {
      this.removeMarker(marker);
      this.map.closePopup();
    };

    const detailsButton = L.DomUtil.create('button', '', div);
    detailsButton.innerHTML = 'Детальніше';
    detailsButton.style.margin = '5px 5px 0 0';
    detailsButton.style.padding = '5px 10px';
    detailsButton.style.border = 'none';
    detailsButton.style.borderRadius = '3px';
    detailsButton.style.cursor = 'pointer';
    detailsButton.style.backgroundColor = '#3498db';
    detailsButton.style.color = 'white';
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