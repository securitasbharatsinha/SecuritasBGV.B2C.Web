import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';
import { AuthComponent } from './auth.component';
import {
  RecaptchaModule,
  RecaptchaSettings,
  RECAPTCHA_SETTINGS,
} from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { reCaptcha_SITE_KEY } from 'src/environments/environment';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TimerComponent } from './timer/timer.component';
import { ResendCodeComponent } from './resend-code/resend-code.component';
import { CaptchaComponent } from './captcha/captcha.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, AuthComponent, ForgotPasswordComponent, TimerComponent, ResendCodeComponent, CaptchaComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: reCaptcha_SITE_KEY } as RecaptchaSettings,
    },
    DatePipe,
  ],
})
export class AuthModule {}
