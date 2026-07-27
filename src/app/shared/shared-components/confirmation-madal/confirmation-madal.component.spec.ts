import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMadalComponent } from './confirmation-madal.component';

describe('ConfirmationMadalComponent', () => {
  let component: ConfirmationMadalComponent;
  let fixture: ComponentFixture<ConfirmationMadalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationMadalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationMadalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
