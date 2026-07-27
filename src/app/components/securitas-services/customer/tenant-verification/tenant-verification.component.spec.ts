import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantVerificationComponent } from './tenant-verification.component';

describe('TenantVerificationComponent', () => {
  let component: TenantVerificationComponent;
  let fixture: ComponentFixture<TenantVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
