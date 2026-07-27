import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckForIndustryComponent } from './check-for-industry.component';

describe('CheckForIndustryComponent', () => {
  let component: CheckForIndustryComponent;
  let fixture: ComponentFixture<CheckForIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckForIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckForIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
