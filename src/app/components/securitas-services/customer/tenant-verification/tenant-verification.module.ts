import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantVerificationRoutingModule } from './tenant-verification-routing.module';
import { TenantVerificationComponent } from './tenant-verification.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TenantVerificationComponent],
  imports: [CommonModule, TenantVerificationRoutingModule, SharedModule],
  exports: [TenantVerificationComponent],
})
export class TenantVerificationModule {}
