import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnergyRoutingModule } from './energy-routing.module';
import { EnergyComponent } from './energy.component';


@NgModule({
  declarations: [
    EnergyComponent
  ],
  imports: [
    CommonModule,
    EnergyRoutingModule
  ]
})
export class EnergyModule { }
