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
    const url = `${this.apiUrl}/documentations?sensorType=${this.sensorType}`;
    this.http.get<Documentation[]>(url).subscribe(response => {
      this.documents = response;
    });
  }
}