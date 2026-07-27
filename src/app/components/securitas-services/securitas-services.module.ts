import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecuritasServicesRoutingModule } from './securitas-services-routing.module';
import { SecuritasServicesComponent } from './securitas-services.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InstantVerifyModule } from './customer/instant-verify/instant-verify.module';
import { DigitalVerificationModule } from './customer/digital-verification/digital-verification.module';
import { HelperVerificationModule } from './customer/helper-verification/helper-verification.module';
import { MatrimonialDueDiligenceModule } from './customer/matrimonial-due-diligence/matrimonial-due-diligence.module';
import { TenantVerificationModule } from './customer/tenant-verification/tenant-verification.module';
import { VendorDueDiligenceModule } from './company/vendor-due-diligence/vendor-due-diligence.module';
import { LeadershipDueDiligenceModule } from './company/leadership-due-diligence/leadership-due-diligence.module';
import { BusinessEmployeeVerificationModule } from './company/business-employee-verification/business-employee-verification.module';
import { NewServicesComponent } from './new-services/new-services.component';
import { DiligenceFormComponent } from './diligence-form/diligence-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SecuritasServicesComponent,
    NewServicesComponent,
    DiligenceFormComponent,
  ],
  imports: [
    CommonModule,
    SecuritasServicesRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InstantVerifyModule,
    DigitalVerificationModule,
    HelperVerificationModule,
    MatrimonialDueDiligenceModule,
    TenantVerificationModule,
    VendorDueDiligenceModule,
    LeadershipDueDiligenceModule,
    BusinessEmployeeVerificationModule,
  ],
})
export class SecuritasServicesModule {}
