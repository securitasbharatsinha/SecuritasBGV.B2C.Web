import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritasServicesComponent } from './securitas-services.component';

describe('SecuritasServicesComponent', () => {
  let component: SecuritasServicesComponent;
  let fixture: ComponentFixture<SecuritasServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuritasServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritasServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
