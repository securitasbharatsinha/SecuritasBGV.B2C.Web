import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigitalVerificationRoutingModule } from './digital-verification-routing.module';
import { DigitalVerificationComponent } from './digital-verification.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DigitalVerificationComponent],
  imports: [CommonModule, DigitalVerificationRoutingModule, SharedModule],
  exports: [DigitalVerificationComponent],
})
export class DigitalVerificationModule {}
