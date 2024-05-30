import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Documentation } from '../../../models/documentation'; // Adjust the import path as needed
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-generate-documents',
  templateUrl: './generate-documents.component.html',
  styleUrls: ['./generate-documents.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GenerateDocumentsComponent implements OnInit {
  @Input() pointId!: number;
  @Input() sensorType!: string;
  documents: Documentation[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    const url = `${this.apiUrl}/documentations`;
    this.http.get<Documentation[]>(url).subscribe(response => {
      this.documents = response.filter(doc => doc.classes === this.getSensorClass(this.sensorType));
    });
  }

  getSensorClass(sensorType: string): string {
    switch (sensorType) {
      case 'Стан повітря':
        return 'air';
      case 'Стан водних ресурсів':
        return 'water';
      case 'Стан ґрунтів':
        return 'soil';
      case 'Рівень радіації':
        return 'radiation';
      case 'Відходи':
        return 'waste';
      case 'Економічний стан':
        return 'economy';
      case 'Стан здоров’я населення':
        return 'health';
      default:
        return '';
    }
  }

  downloadDoc(): void {
    const selectedDocuments = this.documents.filter(doc => doc.selected);
    // Logic to download selected documents as .doc
  }

  downloadXls(): void {
    const selectedDocuments = this.documents.filter(doc => doc.selected);
    // Logic to download selected documents as .xls
  }
}