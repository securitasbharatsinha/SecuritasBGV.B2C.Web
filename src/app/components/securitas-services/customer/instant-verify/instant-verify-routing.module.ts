import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstantVerifyComponent } from './instant-verify.component';

const routes: Routes = [{ path: '', component: InstantVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstantVerifyRoutingModule { }
