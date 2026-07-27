import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthcareRoutingModule } from './healthcare-routing.module';
import { HealthcareComponent } from './healthcare.component';


@NgModule({
  declarations: [
    HealthcareComponent
  ],
  imports: [
    CommonModule,
    HealthcareRoutingModule
  ]
})
export class HealthcareModule { }
