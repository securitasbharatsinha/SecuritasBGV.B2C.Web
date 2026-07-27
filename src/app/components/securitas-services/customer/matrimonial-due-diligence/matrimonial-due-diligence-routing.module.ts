import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatrimonialDueDiligenceComponent } from './matrimonial-due-diligence.component';

const routes: Routes = [{ path: '', component: MatrimonialDueDiligenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatrimonialDueDiligenceRoutingModule { }
