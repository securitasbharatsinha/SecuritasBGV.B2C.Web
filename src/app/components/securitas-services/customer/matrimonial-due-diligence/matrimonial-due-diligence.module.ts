import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatrimonialDueDiligenceRoutingModule } from './matrimonial-due-diligence-routing.module';
import { MatrimonialDueDiligenceComponent } from './matrimonial-due-diligence.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MatrimonialDueDiligenceComponent],
  imports: [CommonModule, MatrimonialDueDiligenceRoutingModule, SharedModule],
  exports: [MatrimonialDueDiligenceComponent],
})
export class MatrimonialDueDiligenceModule {}
