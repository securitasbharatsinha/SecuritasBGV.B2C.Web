import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantVerificationComponent } from './tenant-verification.component';

const routes: Routes = [{ path: '', component: TenantVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantVerificationRoutingModule { }
