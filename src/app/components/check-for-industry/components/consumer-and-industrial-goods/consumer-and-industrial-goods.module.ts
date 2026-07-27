import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumerAndIndustrialGoodsRoutingModule } from './consumer-and-industrial-goods-routing.module';
import { ConsumerAndIndustrialGoodsComponent } from './consumer-and-industrial-goods.component';


@NgModule({
  declarations: [
    ConsumerAndIndustrialGoodsComponent
  ],
  imports: [
    CommonModule,
    ConsumerAndIndustrialGoodsRoutingModule
  ]
})
export class ConsumerAndIndustrialGoodsModule { }
