import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadershipDueDiligenceComponent } from './leadership-due-diligence.component';

const routes: Routes = [{ path: '', component: LeadershipDueDiligenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadershipDueDiligenceRoutingModule { }
