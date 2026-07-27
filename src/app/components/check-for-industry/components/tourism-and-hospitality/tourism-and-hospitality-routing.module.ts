import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourismAndHospitalityComponent } from './tourism-and-hospitality.component';

const routes: Routes = [{ path: '', component: TourismAndHospitalityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourismAndHospitalityRoutingModule { }
