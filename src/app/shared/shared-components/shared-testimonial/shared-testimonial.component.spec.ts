import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTestimonialComponent } from './shared-testimonial.component';

describe('SharedTestimonialComponent', () => {
  let component: SharedTestimonialComponent;
  let fixture: ComponentFixture<SharedTestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTestimonialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
