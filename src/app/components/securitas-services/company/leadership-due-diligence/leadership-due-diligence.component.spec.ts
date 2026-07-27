import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipDueDiligenceComponent } from './leadership-due-diligence.component';

describe('LeadershipDueDiligenceComponent', () => {
  let component: LeadershipDueDiligenceComponent;
  let fixture: ComponentFixture<LeadershipDueDiligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadershipDueDiligenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadershipDueDiligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
