import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureAndTransportationComponent } from './infrastructure-and-transportation.component';

describe('InfrastructureAndTransportationComponent', () => {
  let component: InfrastructureAndTransportationComponent;
  let fixture: ComponentFixture<InfrastructureAndTransportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureAndTransportationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureAndTransportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
