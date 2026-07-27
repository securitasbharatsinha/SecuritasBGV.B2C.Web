import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerWithUsComponent } from './partner-with-us.component';

const routes: Routes = [{ path: '', component: PartnerWithUsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerWithUsRoutingModule { }
