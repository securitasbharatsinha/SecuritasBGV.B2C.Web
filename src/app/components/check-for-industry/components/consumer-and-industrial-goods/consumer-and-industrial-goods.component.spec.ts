import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAndIndustrialGoodsComponent } from './consumer-and-industrial-goods.component';

describe('ConsumerAndIndustrialGoodsComponent', () => {
  let component: ConsumerAndIndustrialGoodsComponent;
  let fixture: ComponentFixture<ConsumerAndIndustrialGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerAndIndustrialGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerAndIndustrialGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
