import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.services';
import { ToasterService } from 'src/app/api-services/toaster.services';

@Component({
  selector: 'app-resend-code',
  templateUrl: './resend-code.component.html',
  styleUrls: ['./resend-code.component.scss'],
})
export class ResendCodeComponent implements OnInit {
  showPassword: boolean;
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
      ActivationCode: [null],
    });
  }

  ngOnInit(): void { }
  submit() {
    if (this.isCodeSent) {
      this.verifyActivationCode();
    } else {
      this.sendCode();
    }
  }
  verifyActivationCode() {
    if (!this.loginForm.valid) {
      this._toaster.showInfoToast('Please enter your email!!');
      return;
    }
    const code = this.loginForm.controls.ActivationCode.value;
    if (code) {
      this._authService
        .validateActivationCode({
          Email: this.loginForm.controls.Email.value,
          ActivationCode: code,
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
        .resendActivationCode(this.loginForm.controls.Email.value)
        .subscribe((res) => {
          if (res && res.IsSuccess) {
            this.isCodeSent = true;
            this._toaster.showSuccessToast(res.Message);
          } else this._toaster.showErrorToast(res.Message);
        });
  }
}
