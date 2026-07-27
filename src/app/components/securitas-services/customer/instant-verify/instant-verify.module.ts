import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstantVerifyRoutingModule } from './instant-verify-routing.module';
import { InstantVerifyComponent } from './instant-verify.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [InstantVerifyComponent],
  imports: [CommonModule, InstantVerifyRoutingModule, SharedModule, NgbModule],
  exports: [InstantVerifyComponent],
})
export class InstantVerifyModule {}
