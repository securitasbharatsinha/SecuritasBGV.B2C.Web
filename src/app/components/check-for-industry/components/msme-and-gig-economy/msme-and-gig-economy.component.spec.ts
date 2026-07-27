import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmeAndGigEconomyComponent } from './msme-and-gig-economy.component';

describe('MsmeAndGigEconomyComponent', () => {
  let component: MsmeAndGigEconomyComponent;
  let fixture: ComponentFixture<MsmeAndGigEconomyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsmeAndGigEconomyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsmeAndGigEconomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
