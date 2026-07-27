import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfrastructureAndTransportationRoutingModule } from './infrastructure-and-transportation-routing.module';
import { InfrastructureAndTransportationComponent } from './infrastructure-and-transportation.component';


@NgModule({
  declarations: [
    InfrastructureAndTransportationComponent
  ],
  imports: [
    CommonModule,
    InfrastructureAndTransportationRoutingModule
  ]
})
export class InfrastructureAndTransportationModule { }
