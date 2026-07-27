import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPackageComponent } from './common-package.component';

describe('CommonPackageComponent', () => {
  let component: CommonPackageComponent;
  let fixture: ComponentFixture<CommonPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
