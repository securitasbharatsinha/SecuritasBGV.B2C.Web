import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadershipDueDiligenceRoutingModule } from './leadership-due-diligence-routing.module';
import { LeadershipDueDiligenceComponent } from './leadership-due-diligence.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LeadershipDueDiligenceComponent],
  imports: [CommonModule, LeadershipDueDiligenceRoutingModule, SharedModule],
  exports: [LeadershipDueDiligenceComponent],
})
export class LeadershipDueDiligenceModule {}
