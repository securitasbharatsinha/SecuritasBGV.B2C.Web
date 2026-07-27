import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsmeAndGigEconomyComponent } from './msme-and-gig-economy.component';

const routes: Routes = [{ path: '', component: MsmeAndGigEconomyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsmeAndGigEconomyRoutingModule { }
