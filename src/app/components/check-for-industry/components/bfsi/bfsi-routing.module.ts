import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BfsiComponent } from './bfsi.component';

const routes: Routes = [{ path: '', component: BfsiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BfsiRoutingModule { }
