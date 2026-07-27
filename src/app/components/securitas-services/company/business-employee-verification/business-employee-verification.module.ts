import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessEmployeeVerificationRoutingModule } from './business-employee-verification-routing.module';
import { BusinessEmployeeVerificationComponent } from './business-employee-verification.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BusinessEmployeeVerificationComponent],
  imports: [
    CommonModule,
    BusinessEmployeeVerificationRoutingModule,
    SharedModule,
  ],
  exports: [BusinessEmployeeVerificationComponent],
})
export class BusinessEmployeeVerificationModule {}
