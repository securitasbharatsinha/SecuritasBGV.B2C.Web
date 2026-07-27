import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessEmployeeVerificationComponent } from './business-employee-verification.component';

const routes: Routes = [{ path: '', component: BusinessEmployeeVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessEmployeeVerificationRoutingModule { }
