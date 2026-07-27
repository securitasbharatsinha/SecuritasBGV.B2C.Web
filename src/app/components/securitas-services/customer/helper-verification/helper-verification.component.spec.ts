import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperVerificationComponent } from './helper-verification.component';

describe('HelperVerificationComponent', () => {
  let component: HelperVerificationComponent;
  let fixture: ComponentFixture<HelperVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelperVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelperVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
