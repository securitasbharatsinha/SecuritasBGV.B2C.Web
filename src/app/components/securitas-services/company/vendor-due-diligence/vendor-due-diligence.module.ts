import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorDueDiligenceRoutingModule } from './vendor-due-diligence-routing.module';
import { VendorDueDiligenceComponent } from './vendor-due-diligence.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [VendorDueDiligenceComponent],
  imports: [CommonModule, VendorDueDiligenceRoutingModule, SharedModule],
  exports: [VendorDueDiligenceComponent],
})
export class VendorDueDiligenceModule {}
