import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgricultureAndAlliedIndustriesComponent } from './agriculture-and-allied-industries.component';

describe('AgricultureAndAlliedIndustriesComponent', () => {
  let component: AgricultureAndAlliedIndustriesComponent;
  let fixture: ComponentFixture<AgricultureAndAlliedIndustriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgricultureAndAlliedIndustriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgricultureAndAlliedIndustriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
