import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Point } from '../../../models/point';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MapComponent implements OnInit {
  map: any;
  markers: L.Marker[] = [];
  customIcon: L.Icon | any;
  private apiUrl = environment.apiUrl;
  showFilterMenu: boolean = false;
  showClassMenu: boolean = false; // New state for Class menu
  filters = {
    airstat: false,
    waterstat: false,
    soilstat: false,
    radiationstat: false,
    waste: false,
    economyStat: false,
    healthStat: false,
    energyStat: false
  };
  selectedClass: string = ''; // New state for selected class

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.initMap();
    this.initCustomIcon();
    this.loadPoints();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [50.4, 30.5], // Kyiv, Ukraine
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

  private getStreetName(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=uk`;
    return this.http.get<any>(url).toPromise().then(response => {
      const address = response.address;
      const road = address.road || address.display_name || 'Unknown street';
      const houseNumber = address.house_number || '';
      return houseNumber ? `${road}, ${houseNumber}` : road;
    }).catch(() => 'Unknown street');
  }

  private loadPoints(): void {
    const filterParams = this.buildFilterParams();
    this.http.get<Point[]>(`${this.apiUrl}/points?${filterParams}`).subscribe(points => {
      this.clearMarkers();
      points.forEach(point => {
        const marker = L.marker([point.cord1, point.cord2], { icon: this.customIcon }).addTo(this.map);
        if (point.id !== undefined) {
          this.fetchClassification(point.id).then(classification => {
            this.getStreetName(point.cord1, point.cord2).then(street => {
              marker.bindPopup(this.createExistingPopupContent(marker, point, classification, street)).openPopup();
            }).catch(() => {
              marker.bindPopup(this.createExistingPopupContent(marker, point, classification)).openPopup();
            });
          }).catch(() => {
            this.getStreetName(point.cord1, point.cord2).then(street => {
              marker.bindPopup(this.createExistingPopupContent(marker, point, undefined, street)).openPopup();
            }).catch(() => {
              marker.bindPopup(this.createExistingPopupContent(marker, point)).openPopup();
            });
          });
        } else {
          this.getStreetName(point.cord1, point.cord2).then(street => {
            marker.bindPopup(this.createExistingPopupContent(marker, point, undefined, street)).openPopup();
          }).catch(() => {
            marker.bindPopup(this.createExistingPopupContent(marker, point)).openPopup();
          });
        }
        this.markers.push(marker);
      });
    });
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }

  private buildFilterParams(): string {
    const params = [];
    const filterKeys: (keyof typeof this.filters)[] = [
      'airstat', 
      'waterstat', 
      'soilstat', 
      'radiationstat', 
      'waste', 
      'economyStat', 
      'healthStat', 
      'energyStat'
    ];

    for (const key of filterKeys) {
      if (this.filters[key]) {
        params.push(`${key}=true`);
      }
    }
    return params.join('&');
  }

  private onMapClick(e: any): void {
    const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: this.customIcon }).addTo(this.map);
    this.getStreetName(e.latlng.lat, e.latlng.lng).then(street => {
      marker.bindPopup(this.createNewPopupContent(marker, street)).openPopup();
    });
    this.markers.push(marker);
  }

  private createNewPopupContent(marker: L.Marker, street: string): HTMLElement {
    const div = L.DomUtil.create('div', 'popup-content');
    const titleInput = L.DomUtil.create('input', 'title-input', div);
    titleInput.type = 'text';
    titleInput.placeholder = street || 'New marker';

    const streetName = L.DomUtil.create('p', '', div);
    streetName.innerHTML = `Street: ${street}`;

    const saveButton = L.DomUtil.create('button', 'save-button', div);
    const saveIcon = L.DomUtil.create('img', 'save-icon', saveButton);
    saveIcon.src = 'assets/diskette-icon.png';
    saveIcon.alt = 'Save';
    saveIcon.style.width = '16px';
    saveIcon.style.height = '16px';
    saveButton.appendChild(saveIcon);
    saveButton.innerHTML += ' Save';
    saveButton.onclick = () => {
      this.saveMarkerData(marker, titleInput);
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

  private createExistingPopupContent(marker: L.Marker, point: Point, classification?: { class: string, index: number }, street?: string): HTMLElement {
    const div = L.DomUtil.create('div', 'popup-content');
    const title = L.DomUtil.create('h4', '', div);
    title.innerHTML = point.title;
  
    if (street) {
      const streetName = L.DomUtil.create('p', 'street-info', div);
      streetName.innerHTML = `Street: ${street}`;
    }
  
    if (classification) {
      const classificationDiv = L.DomUtil.create('div', 'classification', div);
      classificationDiv.innerHTML = `Class: ${classification.class}, Index: ${classification.index}`;
      classificationDiv.style.borderRadius = '5px';
      classificationDiv.style.padding = '10px';
      classificationDiv.style.color = '#fff'; // Default text color
      // Adjust background color based on classification
      switch (classification.class) {
        case 'Дуже добре':
          classificationDiv.style.backgroundColor = 'green';
          break;
        case 'Добре':
          classificationDiv.style.backgroundColor = 'lightgreen';
          classificationDiv.style.color = '#000'; // Make text color black for better visibility
          break;
        case 'Середній':
          classificationDiv.style.backgroundColor = 'yellow';
          classificationDiv.style.color = '#000'; // Make text color black for better visibility
          break;
        case 'Поганий':
          classificationDiv.style.backgroundColor = 'orange';
          break;
        case 'Дуже поганий':
          classificationDiv.style.backgroundColor = 'red';
          break;
        default:
          classificationDiv.style.backgroundColor = 'grey';
      }
    }
  
    const deleteButton = L.DomUtil.create('button', 'delete-button', div);
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = () => {
      this.removeMarker(marker);
      if (point.id != undefined) {
        this.deletePoint(point.id);
      }
      this.map.closePopup();
    };
  
    const detailsButton = L.DomUtil.create('button', 'details-button', div);
    detailsButton.innerHTML = 'Details';
    detailsButton.onclick = () => {
      this.router.navigate(['/point-details', point.id]);
    };
  
    return div;
  }



  private saveMarkerData(marker: L.Marker, titleInput: HTMLInputElement): void {
    let title = titleInput.value.trim();
    if (typeof title == 'undefined' || !title) {
      title = titleInput.placeholder;
    }
    const point: Point = {
      title: title,
      cord1: marker.getLatLng().lat,
      cord2: marker.getLatLng().lng
    };

    this.http.post<Point>(this.apiUrl + '/points', point).subscribe(savedPoint => {
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
    this.http.delete(this.apiUrl + `/points/${id}`).subscribe(() => {
      alert(`Point with id ${id} deleted`);
    });
  }

  private async fetchClassification(pointId: number): Promise<{ class: string, index: number }> {
    const url = `${this.apiUrl}/points/${pointId}/${this.selectedClass}/classification`;
    try {
      const response = await this.http.get<{ class: string, index: number }>(url).toPromise();
      return response || { class: 'Unknown', index: 0 }; // Default fallback value
    } catch (error) {
      return { class: 'Unknown', index: 0 }; // Handle error by returning a default value
    }
  }

  applyFilters(): void {
    this.loadPoints();
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  toggleClassMenu(): void {
    this.showClassMenu = !this.showClassMenu;
  }

  applyClass(): void {
    console.log("Selected Class:", this.selectedClass);
    this.loadPoints(); // Reload points to update classification
  }
}