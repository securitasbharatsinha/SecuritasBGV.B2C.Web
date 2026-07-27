import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPackagesComponent } from './shared-packages.component';

describe('SharedPackagesComponent', () => {
  let component: SharedPackagesComponent;
  let fixture: ComponentFixture<SharedPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
