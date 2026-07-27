import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckForIndustryRoutingModule } from './check-for-industry-routing.module';
import { CheckForIndustryComponent } from './check-for-industry.component';
import { CommonChecksComponent } from './common-checks/common-checks.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [CheckForIndustryComponent, CommonChecksComponent],
  imports: [CommonModule, CheckForIndustryRoutingModule, CarouselModule],
})
export class CheckForIndustryModule {}
