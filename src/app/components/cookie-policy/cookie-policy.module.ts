import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookiePolicyComponent } from './cookie-policy.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: CookiePolicyComponent }];

@NgModule({
  declarations: [CookiePolicyComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CookiePolicyModule {}
