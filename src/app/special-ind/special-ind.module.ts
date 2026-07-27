import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialIndRoutingModule } from './special-ind-routing.module';
import { SpecialIndComponent } from './special-ind.component';


@NgModule({
  declarations: [
    SpecialIndComponent
  ],
  imports: [
    CommonModule,
    SpecialIndRoutingModule
  ]
})
export class SpecialIndModule { }
