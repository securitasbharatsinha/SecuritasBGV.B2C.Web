import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourismAndHospitalityRoutingModule } from './tourism-and-hospitality-routing.module';
import { TourismAndHospitalityComponent } from './tourism-and-hospitality.component';


@NgModule({
  declarations: [
    TourismAndHospitalityComponent
  ],
  imports: [
    CommonModule,
    TourismAndHospitalityRoutingModule
  ]
})
export class TourismAndHospitalityModule { }
