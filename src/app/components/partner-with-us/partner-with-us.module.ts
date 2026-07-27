import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerWithUsRoutingModule } from './partner-with-us-routing.module';
import { PartnerWithUsComponent } from './partner-with-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PartnerWithUsComponent
  ],
  imports: [
    CommonModule,
    PartnerWithUsRoutingModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class PartnerWithUsModule { }
