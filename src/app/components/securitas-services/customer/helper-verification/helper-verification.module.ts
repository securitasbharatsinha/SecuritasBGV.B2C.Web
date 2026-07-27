import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelperVerificationRoutingModule } from './helper-verification-routing.module';
import { HelperVerificationComponent } from './helper-verification.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HelperVerificationComponent],
  imports: [CommonModule, HelperVerificationRoutingModule, SharedModule],
  exports: [HelperVerificationComponent],
})
export class HelperVerificationModule {}
