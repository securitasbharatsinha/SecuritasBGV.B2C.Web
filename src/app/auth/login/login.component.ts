import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { takeWhile } from 'rxjs/operators';
import { buyPackages } from 'src/app/api-interfaces/home-page';
import { AuthService } from 'src/app/api-services/auth.services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { getPortalPath, reCaptcha_SITE_KEY } from 'src/environments/environment';
import { COOKIE_DOMAIN } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CaptchaComponent } from '../captcha/captcha.component';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/api-services/helper.services';
declare var grecaptcha: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginWithOtp: boolean = false
  @ViewChild('captcha') captcha: CaptchaComponent
  captchaToken: string | undefined;
  reCaptchaSiteKey: string = reCaptcha_SITE_KEY;
  loginForm: FormGroup;
  isLive: boolean = true;
  showPassword: boolean = false;
  isSpecialWindow: boolean = false;
  isOtpSent: boolean;
  getPortalPath: string = getPortalPath('');
  OTP: string;
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _homepageService: HomePageService,
    private _router: Router,
    private _cookie: CookieService,
    private _toaster: ToasterService,
    private _helper: HelperService
  ) {
    this.isSpecialWindow = this._router.url.includes('special')


  }
  ngOnDestroy(): void {
    this.isLive = false;
  }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      Email: [null, [Validators.required]],
      Password: [null],
    });
  }
  loginUser() {
    let req: any;
    const captcha = this.captcha.CaptchaMatched;
    if (this.loginForm.valid && captcha) {
      if (!this.loginWithOtp) {
        if (!this.loginForm.controls.Password.value) {
          this._toaster.showInfoToast('Required fields are empty !!')
          return
        }
        req = this._authService
          .login({ ...this.loginForm.value })
        // .doAuth(this.loginForm.value.Email, this.loginForm.value.Password)
      }
      if (this.loginWithOtp && this.isOtpSent) {
        req = this._authService
          .loginWithOTP({ ...this.loginForm.value }, this.OTP)
      }

      req.pipe(takeWhile(() => this.isLive))
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess && res.Data && res?.Data?.Isactive) {
              // if (res.Data?.RoleID === 4 && res.Data?.status !== 'Active') {
              //   this.openAlert();
              //   return;
              // }
              this._cookie.set('userId', res.Data.Id);
              this._cookie.set('isLoggedIn', 'true');
              this._cookie.set('userType', res.Data.RoleID);
              this._cookie.set(
                'industryType',
                res.Data?.CompanyInfo?.CompanyIndustry
              );
              this._cookie.set('userCatgeory', res.Data.user_category);
              this._cookie.set('token', res?.Data.Token);
              this._cookie.set('token', res?.Data.Token);
              this._cookie.set('adminEmail', res?.Data?.Email?.trim());
              this._cookie.set('clientId', res?.Data?.ClientId);

              // NOTE Setting Root Cookie
              const authObj: Partial<{
                userId: any;
                isLoggedIn: boolean;
                tenant: string;
                token: string;
                userCatgeory: string;
                userType: number;
                adminEmail: string;
                industryType: number;
                clientId: any;

              }> = {
                userId: res.Data.Id,
                isLoggedIn: true,
                tenant: 'securitas-b2c',
                token: res?.Data.Token,
                userType: res.Data.RoleID,
                userCatgeory: res.Data.user_category,
                adminEmail: res?.Data?.Email?.trim(),
                industryType: Number(
                  res.Data?.CompanyInfo?.CompanyIndustry ?? 0
                ),
                clientId: res?.Data?.ClientId,
              };
              this._helper.isLoggedOut.next(false);
              // document.cookie = `auth=${authObj}; path=/;`;
              document.cookie = `sessionauth=${JSON.stringify(
                authObj
              )}; domain=${COOKIE_DOMAIN}; secure; samesite=none; path=/; `;
              this._toaster.showSuccessToast('Logged In successfully.');
              // this._router.navigate([!res?.Data?.ClientId ? '/home' : '/special/individual']);
              const getUrl = window.location.hash.replace('#', '');
              if (getUrl) {
                let urlFragment = '';
                if(getUrl === '/helper-verification') urlFragment = 'supportVerification';
                else if(getUrl === '/tenant-verification') urlFragment = 'tenantVerification';
                else if(getUrl === '/instant-verify') urlFragment = 'instantVerify';
                else if(getUrl === '/matrimonial-due-diligence') urlFragment = 'matrimonialVerify';
                this._router.navigate([`/individual`], {fragment: urlFragment});
              }
              else{
                window.location.href = this.getPortalPath;
              }
            }
            else if(!res?.Data?.Isactive && res?.IsSuccess && res?.Data){
              this._toaster.showErrorToast('Account On-Hold - Please contact the helpdesk for further information');
            }
            else {
              this._toaster.showErrorToast(res.Message);
              // this._toaster.showErrorToast('Incorrect email/password!!');
            }
          },
          (error: any) => {
            // this.isDisabled = false
            if (error?.error_description)
              this._toaster.showErrorToast(error?.error_description);
          }
        );
    } else {
      !this.loginForm.valid
        ? this._toaster.showInfoToast('Required fields are empty !!')
        : this._toaster.showErrorToast('wrong/empty captcha code!!');
      this.loginForm.markAllAsTouched();
    }
  }
  // loginUser() {
  //   if (this.loginForm.valid && this.captchaToken) {
  //     this._authService
  //       .login({ ...this.loginForm.value })
  //       // .doAuth(this.loginForm.value.Email, this.loginForm.value.Password)
  //       .pipe(takeWhile(() => this.isLive))
  //       .subscribe(
  //         (res: any) => {
  //           if (res) {
  //             this._cookie.set('userId', res.Id);
  //             this._cookie.set('isLoggedIn', 'true');
  //             this._cookie.set('userType', '1');
  //             this._cookie.set('token', res.access_token);

  //             // NOTE Setting Root Cookie
  //             const authObj: Partial<{
  //               userId: any;
  //               isLoggedIn: boolean;
  //               tenant: string;
  //               token: string;
  //               userType: number;
  //             }> = {
  //               userId: res.Id,
  //               isLoggedIn: true,
  //               tenant: 'securitas-b2c',
  //               token: res.access_token,
  //               userType: 1,
  //             };

  //             // document.cookie = `auth=${authObj}; path=/;`;
  //             document.cookie = `sessionauth=${JSON.stringify(
  //               authObj
  //             )}; domain=${COOKIE_DOMAIN}; secure; samesite=none; path=/; `;
  //             // this._toaster.showSuccessToast('Logged In successfully.');
  //             Swal.fire({
  //               title: 'Logged In successfully.',
  //               icon: 'success',
  //               showConfirmButton: false,
  //               confirmButtonColor: '#3085d6',
  //               timer: 2000,

  //               allowOutsideClick: false,

  //               showClass: {
  //                 popup: 'animate__animated animate__fadeInDown',
  //               },
  //             });

  //             this._router.navigate(['/home']);
  //           }
  //         },
  //         ({ error }) => {
  //           // this.isDisabled = false
  //           if (error?.error_description) alert(error?.error_description);
  //         }
  //       );
  //   } else {
  //     this.loginForm.markAllAsTouched();
  //   }
  // }
  buySelctedpackage() {
    const req: buyPackages = {
      ...JSON.parse(localStorage.getItem('selectedPackage') || ''),
      userDetails: {
        Id: Number(
          localStorage.getItem('isLoggedIn') === 'true'
            ? localStorage.getItem('userId')
            : null
        ),
      },
    };

    this._homepageService.buyServicePackages(req).subscribe((res: any) => {
      localStorage.removeItem('isPackageSelected');
      localStorage.removeItem('selectedPackage');
    });
  }
  openAlert() {
    Swal.fire({
      text: 'Thank you for the registration. Your application is under review. We will get back to you within 1-2 business days.',
      icon: 'info',
      showCancelButton: false,
      showConfirmButton: false,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
      } else {
      }
    });
  }
  sendOTP() {
    const email = this.loginForm.controls.Email
    if (email.value && email.valid) {
      this._authService.sendOtp(email.value).pipe(takeWhile(() => this.isLive)).subscribe((res) => {
        if (res && res?.IsSuccess) {
          this.isOtpSent = true;
          this._toaster.showSuccessToast(res?.Message)
        }
        else if(res && !res?.IsSuccess){
          this._toaster.showErrorToast(res?.Message)
        }
      })
    }
  }
}
