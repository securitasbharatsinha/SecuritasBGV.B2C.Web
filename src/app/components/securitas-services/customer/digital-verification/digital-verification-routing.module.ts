import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalVerificationComponent } from './digital-verification.component';

const routes: Routes = [{ path: '', component: DigitalVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalVerificationRoutingModule { }
