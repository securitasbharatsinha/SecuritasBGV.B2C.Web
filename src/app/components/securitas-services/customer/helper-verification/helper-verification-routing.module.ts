import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelperVerificationComponent } from './helper-verification.component';

const routes: Routes = [{ path: '', component: HelperVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelperVerificationRoutingModule { }
