import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrimonialDueDiligenceComponent } from './matrimonial-due-diligence.component';

describe('MatrimonialDueDiligenceComponent', () => {
  let component: MatrimonialDueDiligenceComponent;
  let fixture: ComponentFixture<MatrimonialDueDiligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrimonialDueDiligenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrimonialDueDiligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
