import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorDueDiligenceComponent } from './vendor-due-diligence.component';

const routes: Routes = [{ path: '', component: VendorDueDiligenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorDueDiligenceRoutingModule { }
