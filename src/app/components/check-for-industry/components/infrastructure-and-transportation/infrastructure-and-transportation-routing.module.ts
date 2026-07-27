import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfrastructureAndTransportationComponent } from './infrastructure-and-transportation.component';

const routes: Routes = [{ path: '', component: InfrastructureAndTransportationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfrastructureAndTransportationRoutingModule { }
