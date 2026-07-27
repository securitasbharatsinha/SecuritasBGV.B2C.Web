import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialIndComponent } from './special-ind.component';

describe('SpecialIndComponent', () => {
  let component: SpecialIndComponent;
  let fixture: ComponentFixture<SpecialIndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialIndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
