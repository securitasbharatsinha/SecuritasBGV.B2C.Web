import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomCartSheetComponent } from './bottom-cart-sheet.component';

describe('BottomCartSheetComponent', () => {
  let component: BottomCartSheetComponent;
  let fixture: ComponentFixture<BottomCartSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomCartSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomCartSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
