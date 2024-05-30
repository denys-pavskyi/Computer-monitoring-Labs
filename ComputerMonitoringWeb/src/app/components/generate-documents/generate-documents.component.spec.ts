import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDocumentsComponent } from './generate-documents.component';

describe('GenerateDocumentsComponent', () => {
  let component: GenerateDocumentsComponent;
  let fixture: ComponentFixture<GenerateDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
