import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourismAndHospitalityComponent } from './tourism-and-hospitality.component';

describe('TourismAndHospitalityComponent', () => {
  let component: TourismAndHospitalityComponent;
  let fixture: ComponentFixture<TourismAndHospitalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourismAndHospitalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourismAndHospitalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
