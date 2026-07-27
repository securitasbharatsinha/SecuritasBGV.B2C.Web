import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgricultureAndAlliedIndustriesComponent } from './agriculture-and-allied-industries.component';

const routes: Routes = [{ path: '', component: AgricultureAndAlliedIndustriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgricultureAndAlliedIndustriesRoutingModule { }
