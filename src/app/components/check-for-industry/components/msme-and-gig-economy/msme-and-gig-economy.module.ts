import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MsmeAndGigEconomyRoutingModule } from './msme-and-gig-economy-routing.module';
import { MsmeAndGigEconomyComponent } from './msme-and-gig-economy.component';


@NgModule({
  declarations: [
    MsmeAndGigEconomyComponent
  ],
  imports: [
    CommonModule,
    MsmeAndGigEconomyRoutingModule
  ]
})
export class MsmeAndGigEconomyModule { }
