import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/api-services/auth.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { CustomValidators } from '../custom-validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  showErrors: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loginForm: FormGroup;
  captchaToken: string;
  Email: string;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$';
  isCodeSent: boolean;
  isSpecialWindow: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _toaster: ToasterService,
    private _router: Router
  ) {
    this.isSpecialWindow = this._router.url.includes('special')

    this.loginForm = this._fb.group({
      Email: [
        null,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
        ],
      ],
      OTP: [null, Validators.required],
      Password: [
        null,
        [
          Validators.required,

          Validators.compose([
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(/(?=.{8,})/, {
              hasEight: true,
            }),

            CustomValidators.patternValidator(/[^A-Za-z0-9 ]/, {
              hasSpecialCharacters: true,
            }),
          ]),
        ],
      ],
      ConfirmPassword: [null, [Validators.required]],
    });
  }

  ngOnInit(): void { }
    submit() {
    if (this.isCodeSent) {
      if (this.loginForm.get('Password')?.value !== this.loginForm.get('ConfirmPassword')?.value) {
        console.log('MISMATCH:', this.loginForm.get('Password')?.value, this.loginForm.get('ConfirmPassword')?.value);
        this._toaster.showErrorToast('Passwords do not match');
        return;
      }
      this.resetPassword();
    } else {
      this.sendCode();
    }
  }
  resetPassword() {
    if (!this.loginForm.valid) {
      this._toaster.showInfoToast('Please fill required fields!!');
      return;
    }
    const code = this.loginForm.controls.OTP.value;
    if (code) {
      this._authService
        .resetPassword({
          ...this.loginForm.value,
        })
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess) {
              this._toaster.showSuccessToast(res.Message);
              this._router.navigate(['/auth']);
            } else {
              this._toaster.showErrorToast(res.Message);
            }
          },
          (err) => {
            this._toaster.showErrorToast('Wrong authentication code!!');
          }
        );
    } else {
      this._toaster.showInfoToast('Fill the authentication code to verify!!');
    }
  }
  sendCode() {
    this.loginForm.controls.Email.valid &&
      this._authService
        .ForgotPasswordOTPGenerate(this.loginForm.controls.Email.value)
        .subscribe((res) => {
          if (res && res.IsSuccess) {
            this.isCodeSent = true;
            this._toaster.showSuccessToast(res.Message);
          } else this._toaster.showErrorToast(res.Message);
        });
  }
  getHasError(control: any) {
    return this.loginForm.controls['Password'].hasError(control);
  }
}