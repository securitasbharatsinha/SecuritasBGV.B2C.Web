import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgricultureAndAlliedIndustriesRoutingModule } from './agriculture-and-allied-industries-routing.module';
import { AgricultureAndAlliedIndustriesComponent } from './agriculture-and-allied-industries.component';


@NgModule({
  declarations: [
    AgricultureAndAlliedIndustriesComponent
  ],
  imports: [
    CommonModule,
    AgricultureAndAlliedIndustriesRoutingModule
  ]
})
export class AgricultureAndAlliedIndustriesModule { }
