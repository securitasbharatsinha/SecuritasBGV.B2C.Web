import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCartComponent } from './shared-cart.component';

describe('SharedCartComponent', () => {
  let component: SharedCartComponent;
  let fixture: ComponentFixture<SharedCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
