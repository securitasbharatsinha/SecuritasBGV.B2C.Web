import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessEmployeeVerificationComponent } from './business-employee-verification.component';

describe('BusinessEmployeeVerificationComponent', () => {
  let component: BusinessEmployeeVerificationComponent;
  let fixture: ComponentFixture<BusinessEmployeeVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessEmployeeVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessEmployeeVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
