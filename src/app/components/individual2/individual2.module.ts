import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Individual2Component } from './individual2.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: Individual2Component,
  },
];
@NgModule({
  declarations: [Individual2Component],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class Individual2Module {}
