import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Documentation } from '../../../models/documentation'; // Adjust the import path as needed
import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as XLSX from 'xlsx';

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
  @Input() pointTitle!: string;
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
    if (selectedDocuments.length === 0) {
      alert('Please select at least one document.');
      return;
    }

    const doc = this.createDocument(selectedDocuments);
    let curr_date = new Date().toISOString();
    const date = curr_date.split('T')[0] + curr_date.split('T')[1];
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `recommended_measures_${date}.docx`);
    });
  }

  createDocument(documents: Documentation[]): Document {
    const paragraphs = [
      new Paragraph({
        children: [
          new TextRun({
            text: `Рішенням керівника підприємства ${this.pointTitle} сформовано список заходів, які потрібно запровадити на установі:`,
            font: "Times New Roman",
            size: 24
          })
        ]
      })
    ];

    documents.forEach((doc, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}) ${doc.action}, підставою якого є ${doc.document}; Ціна: ${doc.price.toFixed(2)} грн`,
              break: 1,
              font: "Times New Roman",
              size: 24
            })
          ]
        })
      );
    });

    const totalPrice = documents.reduce((sum, doc) => sum + (doc.price || 0), 0);
    const date = new Date().toLocaleDateString();

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Загальна вартість: ${totalPrice.toFixed(2)} грн`, break: 1, font: "Times New Roman", size: 24 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Дата: ${date}`, break: 1, font: "Times New Roman", size: 24 })
        ]
      })
    );

    return new Document({
      sections: [
        {
          properties: {},
          children: paragraphs
        }
      ]
    });
  }

  downloadXls(): void {
    const selectedDocuments = this.documents.filter(doc => doc.selected);
    if (selectedDocuments.length === 0) {
      alert('Please select at least one document.');
      return;
    }

    const date = new Date().toISOString().split('T')[0];
    const ws_data = [
      [`Рішенням керівника підприємства ${this.pointTitle} сформовано список заходів, які потрібно запровадити на установі:`],
      ...selectedDocuments.map((doc, index) => [
        `${index + 1}) ${doc.action}, підставою якого є ${doc.document}`,
        doc.price.toFixed(2)
      ]),
      [`Загальна вартість:`, selectedDocuments.reduce((sum, doc) => sum + (doc.price || 0), 0).toFixed(2)],
      [`Дата: ${new Date().toLocaleDateString()}`]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Format cells
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;
        ws[cell_ref].s = {
          font: { name: "Times New Roman", sz: 12 },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
    }

    // Adjust column widths dynamically based on content
    const colWidths = ws_data[0].map((_, colIndex) => {
      const column = ws_data.map(row => row[colIndex]);
      const maxLength = Math.max(...column.map(cell => cell.toString().length));
      return { wch: maxLength };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Recommended Measures');

    const xlsData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([xlsData], { type: 'application/octet-stream' });
    saveAs(blob, `recommended_measures_${date}.xlsx`);
  }
}