import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorGraphsComponent } from './sensor-graphs.component';

describe('SensorGraphsComponent', () => {
  let component: SensorGraphsComponent;
  let fixture: ComponentFixture<SensorGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorGraphsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
