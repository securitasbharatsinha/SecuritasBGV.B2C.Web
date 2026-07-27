import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalVerificationComponent } from './digital-verification.component';

describe('DigitalVerificationComponent', () => {
  let component: DigitalVerificationComponent;
  let fixture: ComponentFixture<DigitalVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
