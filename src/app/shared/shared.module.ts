import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import sharedComponents from './shared-components/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NumberConterComponent } from './shared-components/shared-achievements/number-conter/number-conter.component';


@NgModule({
  declarations: [...sharedComponents, NumberConterComponent,],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CarouselModule],
  exports: [...sharedComponents],
})
export class SharedModule { }
