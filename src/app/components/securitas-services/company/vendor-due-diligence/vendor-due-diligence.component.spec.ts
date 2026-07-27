import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDueDiligenceComponent } from './vendor-due-diligence.component';

describe('VendorDueDiligenceComponent', () => {
  let component: VendorDueDiligenceComponent;
  let fixture: ComponentFixture<VendorDueDiligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorDueDiligenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDueDiligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
