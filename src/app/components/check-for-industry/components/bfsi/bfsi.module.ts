import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BfsiRoutingModule } from './bfsi-routing.module';
import { BfsiComponent } from './bfsi.component';


@NgModule({
  declarations: [
    BfsiComponent
  ],
  imports: [
    CommonModule,
    BfsiRoutingModule
  ]
})
export class BfsiModule { }
