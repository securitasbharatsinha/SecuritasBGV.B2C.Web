import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialIndComponent } from './special-ind.component';

const routes: Routes = [{
  path: '', component: SpecialIndComponent, children: [
    { path: '', redirectTo: 'login' },
    // { path: 'login', component: LoginComponent },
    // { path: 'signup', component: SignupComponent },
    // { path: 'forgotpassword', component: ForgotPasswordComponent },
    // { path: 'verifyemail', component: ResendCodeComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialIndRoutingModule { }
