import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerAndIndustrialGoodsComponent } from './consumer-and-industrial-goods.component';

const routes: Routes = [{ path: '', component: ConsumerAndIndustrialGoodsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerAndIndustrialGoodsRoutingModule { }
