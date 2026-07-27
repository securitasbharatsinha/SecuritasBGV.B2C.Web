import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonChecksComponent } from './common-checks.component';

describe('CommonChecksComponent', () => {
  let component: CommonChecksComponent;
  let fixture: ComponentFixture<CommonChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
