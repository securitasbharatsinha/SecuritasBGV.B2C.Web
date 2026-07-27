import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { retry, switchMap, take, takeLast, takeWhile } from 'rxjs/operators';
import { signUp } from 'src/app/api-interfaces/auth-page';
import { buyPackages } from 'src/app/api-interfaces/home-page';
import { AuthService } from 'src/app/api-services/auth.services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import {
  clientRoleId,
  corporateId,
  genSxty,
  individualId,
  reCaptcha_SITE_KEY,
  walsonsApiEndPoint,
} from 'src/environments/environment';
import { CustomValidators } from '../custom-validators';
import { industries } from 'src/app/components/check-for-industry/industry';
import { CaptchaComponent } from '../captcha/captcha.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  @ViewChild('captcha') captcha: CaptchaComponent;

  captchaToken: string | undefined;
  reCaptchaSiteKey: string = reCaptcha_SITE_KEY;
  currentStepindex: number = 0;
  currentStepindex2: number = 0;
  selectedTypeForRegistration: any;
  signUpForm: FormGroup;
  isStepperVaildted: boolean = false;
  isCStepperVaildted: boolean = false;
  selectedSignupType: string = 'select';
  ActivationCode: FormControl = new FormControl('', Validators.required);
  passwordPattern =
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
  phonePattern = '((([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4})';

  // emailPattern = '[a-z0-9]+@[a-z]+.[a-z]{2,4}';
  emailPattern = '^[a-z0-9._%]+@[a-z0-9.-]+[.][a-z]{2,4}$';
  // emailPattern = `^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3,4})+$`;
  gstPattern = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
  isCodeVerified: boolean = false;
  isFormSubmitted: boolean = false;

  selectedTab: string = 'Individual';
  verifyTemplate: string = '';
  showPassword: boolean = false;
  todayDate: any;
  dialCodes: any;
  countryCode: string = 'IN';
  selectedDialCode: string = this.countryCode;
  dialCode: string = '+91';
  showErrors: boolean;
  industries = industries;
  isSpecialWindow: boolean = false;
  gstLoading: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _homepageService: HomePageService,
    private _router: Router,
    private _toaster: ToasterService,
    private _datePipe: DatePipe,
    private _route: ActivatedRoute,
    private _http: HttpClient
  ) {
    this.isSpecialWindow = this._router.url.includes('special');
    this.signUpForm = this._fb.group({
      authorized_by: [],
      authorization_date: [],
      Prefix: [null, [Validators.required]],
      FName: ['', [Validators.required]], //added (dot -> .) with (space ->  )
      LName: ['', [Validators.required]], //added (dot -> .) with (space ->  )
      MName: ['', []], //added (dot -> .) with (space ->  )
      Email: [
        '',
        [
          Validators.required,
          // Validators.compose([
          //   Validators.pattern(this.emailPattern),
          //   CustomValidators.emailHasUppercase(/[A-Z]/, {
          //     hasCapitalCase: true,
          //   }),
          // ]),
        ],
        // [CustomValidators.emailValidator(this._authService)],
      ],
      UserName: [null],
      DOB: [null],
      Password: [
        null,
        [
          Validators.required,

          // Validators.compose([
          //   CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          //   CustomValidators.patternValidator(/[A-Z]/, {
          //     hasCapitalCase: true,
          //   }),
          //   CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          //   CustomValidators.patternValidator(/(?=.{8,})/, {
          //     hasEight: true,
          //   }),

          //   CustomValidators.patternValidator(/[^A-Za-z0-9 ]/, {
          //     hasSpecialCharacters: true,
          //   }),
          // ]),
        ],
      ],
      CompanyInfo: this._fb.group({
        CompanyName: [null],
        CompanyEmail: [null],
        CompanyPhone: [null],
        CompanyGST: [null],
        CompanyAddress1: [''],
        CompanyAddress2: [''],
        CompanyDistrict: [''],
        CompanyState: [null],
        CompanyPincode: [null],
        CompanyCountry: [null],
        CompanyIndustry: [null],
        ExpectedCases: [null],
      }),

      RoleID: [null],
      Phone: [
        '',
        [
          // Validators.pattern('[0-9]{10}'),
          Validators.required,
          // Validators.max(9999999999),
          // Validators.min(1),
          // Validators.maxLength(10),
        ],
      ],
      Address1: [null],
      Address2: [null],
      District: [null],
      State: [null],
      Pincode: [null],
      Designation: [null],
      VarificationFor: [null],
      IsAddressSame: [false],
      IsAgreement: [false],
    });
    this.fetch((data: any) => {
      this.dialCodes = data;
    });
  }
  fetch(cb: any) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/CountryCodes.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
  ngOnInit(): void {
    this.startAutoRotate();
    this._route.queryParams.subscribe((prm) => {
      if (prm && prm.type && prm.type === 'Corporate') {
        const elm = document.getElementById('corporateButton') as HTMLElement;
        this.changeTab(elm, 'Corporate');
      } else {
        if (isPlatformBrowser(this.platformId)) {
          var defaultOpen = document.getElementById(
            'Individual'
          ) as HTMLElement;

          defaultOpen.click();
        }
      }
    });
    this.todayDate = this._datePipe.transform(
      new Date(Date.now()),
      'yyyy-MM-dd'
    );
  }

  signupold() {
    let captcha = this.captcha.CaptchaMatched;
    if (
      this.signUpForm.valid &&
      captcha &&
      this.signUpForm.controls.IsAgreement.value
    ) {
      const payload: signUp = {
        ...this.signUpForm.value,
        Phone: `${this.signUpForm.controls.Phone.value}`,
        // Phone: `${this.dialCode}-${this.signUpForm.controls.Phone.value}`,
        RoleID: this.selectedTypeForRegistration ? corporateId : individualId,
        isSpecialClient: this.isSpecialWindow ? 1 : 0,
        ClientId: this.isSpecialWindow ? genSxty : null,
        user_category: 'prepaid',
        // status: this.selectedTypeForRegistration ? 'Inactive' : 'Active',
        status: 'Active',
      };

      this._authService.postUserData(payload).subscribe(
        (res: any) => {
          if (res && res.IsSuccess) {
            this.verifyTemplate = 'Authentication';
            this._toaster.showSuccessToast(
              'OTP sent on registered mail successfully'
            );
          } else {
            this._toaster.showErrorToast(res.Message);
          }
        },
        (err) => {
          this._toaster.showErrorToast('Something went wrong !!');

        }
      );
    } else {
      this.signUpForm.markAllAsTouched();
      if (!this.signUpForm.valid) {
        this._toaster.showInfoToast('Required fields are empty !!');
        return;
      }
      if (!this.signUpForm.controls.IsAgreement.value) {
        this._toaster.showErrorToast(
          'You must agree to the terms and conditions before proceeding !!'
        );
        return;
      }
      if (!captcha) this._toaster.showErrorToast('wrong/empty captcha code!!');
      // !captcha && this._toaster.showErrorToast('wrong/empty captcha code!!')

      if (this.signUpForm.get('CompanyInfo.CompanyGST')?.errors?.error) {
        this._toaster.showErrorToast('Please provide valid GST No!!');
        return;
      }
      if (this.signUpForm.get('CompanyInfo.CompanyPincode')?.errors?.error) {
        this._toaster.showErrorToast('Please provide valid pin code!!');
        return;
      }
    }
  }

  signup(){
  let captcha = this.captcha.CaptchaMatched;
    if (
      this.signUpForm.valid &&
      captcha &&
      this.signUpForm.controls.IsAgreement.value
    ) {
      const payload: signUp = {
        ...this.signUpForm.value,
        Phone: `${this.signUpForm.controls.Phone.value}`,
        // Phone: `${this.dialCode}-${this.signUpForm.controls.Phone.value}`,
        RoleID: this.selectedTypeForRegistration ? corporateId : individualId,
        isSpecialClient: this.isSpecialWindow ? 1 : 0,
        ClientId: this.isSpecialWindow ? genSxty : null,
        user_category: 'prepaid',
        // status: this.selectedTypeForRegistration ? 'Inactive' : 'Active',
        status: 'Active',
      };

      this._authService.postUserData(payload).subscribe(
        (res: any) => {
          if (res && res.IsSuccess) {
            this.verifyTemplate = 'Authentication';
            this._toaster.showSuccessToast(
              'OTP sent on registered mail successfully'
            );
          } else {
            this._toaster.showErrorToast(res.Message);
          }
        },
        (err) => {
          this._toaster.showErrorToast('Something went wrong !!');

        }
      );
    } else {
      this.signUpForm.markAllAsTouched();
      if (!this.signUpForm.valid) {
        this._toaster.showInfoToast('Required fields are empty !!');
        return;
      }
      if (!this.signUpForm.controls.IsAgreement.value) {
        this._toaster.showErrorToast(
          'You must agree to the terms and conditions before proceeding !!'
        );
        return;
      }
      if (!captcha) this._toaster.showErrorToast('wrong/empty captcha code!!');
      // !captcha && this._toaster.showErrorToast('wrong/empty captcha code!!')

      if (this.signUpForm.get('CompanyInfo.CompanyGST')?.errors?.error) {
        this._toaster.showErrorToast('Please provide valid GST No!!');
        return;
      }
      if (this.signUpForm.get('CompanyInfo.CompanyPincode')?.errors?.error) {
        this._toaster.showErrorToast('Please provide valid pin code!!');
        return;
      }
    }
  }

  verifyActivationCode(code: any, type: string = '') {
    if (code) {
      this._authService
        .validateActivationCode({
          Email: this.signUpForm.controls.Email.value,
          ActivationCode: code,
        })
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess) {
              this._toaster.showSuccessToast(res.Message);

              this._router.navigate([
                !this.isSpecialWindow ? '/auth' : '/special/login',
              ]);
              if (localStorage.getItem('isPackageSelected') === 'true')
                this.buySelctedpackage();
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
  resendCode() {
    this._authService
      .resendActivationCode(this.signUpForm.controls.Email.value)
      .subscribe((res) => {
        if (res && res.IsSuccess) this._toaster.showSuccessToast(res.Message);
        else this._toaster.showErrorToast(res.Message);
      });
  }

  buySelctedpackage() {
    const req: buyPackages = JSON.parse(
      localStorage.getItem('selectedPackage') || ''
    );
    this._homepageService.buyServicePackages(req).subscribe((res: any) => {
      if (res) localStorage.removeItem('isPackageSelected');
    });
  }

  showGif() {
    this.isFormSubmitted = true;
  }

  changeTab(evt: any, tabName: string) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      //  tabcontent[i].style.display  = "none";
      tabcontent[i].setAttribute('display', 'none');
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    var c_name = document.getElementById(tabName) as HTMLElement;
    <HTMLElement>(<unknown>c_name.setAttribute('display', 'block'));
    c_name.classList.add('active');

    // evt.currentTarget.className += ' active';
    this.selectedTab = tabName;
    this.selectedDialCode = this.countryCode;
    this.dialCode = '+91';

    if (tabName === 'Corporate') this.selectedTypeForRegistration = true;
    if (tabName === 'Individual') this.selectedTypeForRegistration = false;
    this.verifyTemplate = '';
    this.captchaToken = undefined;

    this.signUpForm.reset();
    if (tabName === 'Corporate') {
      this.signUpForm.get('DOB')?.clearValidators();
      this.signUpForm.get('DOB')?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyName')
        ?.setValidators([Validators.required]);
      // this.signUpForm.get('IsAgreement')?.setValidators([Validators.required]);
      this.signUpForm
        .get('CompanyInfo.CompanyGST')
        ?.setValidators([
          Validators.required,
          Validators.pattern(this.gstPattern),
        ]);
      // this.signUpForm
      //   .get('CompanyInfo.CompanyGST')
      //   ?.setAsyncValidators([
      //     CustomValidators.gstValidator(this._authService),
      //   ]);

      this.signUpForm
        .get('CompanyInfo.CompanyAddress1')
        ?.setValidators([Validators.required]);
      this.signUpForm
        .get('CompanyInfo.CompanyPincode')
        ?.setValidators([Validators.required]);
      this.signUpForm
        .get('CompanyInfo.CompanyState')
        ?.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z ]*'),
        ]);
      this.signUpForm
        .get('CompanyInfo.CompanyDistrict')
        ?.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z ]*'),
        ]);
      this.signUpForm.get('CompanyInfo.CompanyCountry')?.patchValue('India');
      this.signUpForm
        .get('CompanyInfo.CompanyCountry')
        ?.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z ]*'),
        ]);
      this.signUpForm
        .get('CompanyInfo.ExpectedCases')
        ?.setValidators([Validators.required]);
      this.signUpForm
        .get('CompanyInfo.CompanyIndustry')
        ?.setValidators([Validators.required]);
      // this.signUpForm.get('IsAgreement')?.updateValueAndValidity();
      this.signUpForm.get('CompanyInfo.CompanyName')?.updateValueAndValidity();
      this.signUpForm.get('CompanyInfo.CompanyGST')?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyAddress1')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyPincode')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyDistrict')
        ?.updateValueAndValidity();
      this.signUpForm.get('CompanyInfo.CompanyState')?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyCountry')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.ExpectedCases')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyIndustry')
        ?.updateValueAndValidity();
    } else {
      this.signUpForm
        .get('DOB')
        ?.setValidators([Validators.required, this.DobValidation()]);
      this.signUpForm.get('DOB')?.updateValueAndValidity();
      // this.signUpForm.get('IsAgreement')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyName')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyGST')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyAddress1')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyPincode')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyState')?.clearValidators();
      this.signUpForm.get('CompanyInfo.ExpectedCases')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyIndustry')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyDistrict')?.clearValidators();
      this.signUpForm.get('CompanyInfo.CompanyCountry')?.clearValidators();
      // this.signUpForm.get('IsAgreement')?.updateValueAndValidity();
      this.signUpForm.get('CompanyInfo.CompanyName')?.updateValueAndValidity();
      this.signUpForm.get('CompanyInfo.CompanyGST')?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyAddress1')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyPincode')
        ?.updateValueAndValidity();
      this.signUpForm.get('CompanyInfo.CompanyState')?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.ExpectedCases')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyIndustry')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyDistrict')
        ?.updateValueAndValidity();
      this.signUpForm
        .get('CompanyInfo.CompanyCountry')
        ?.updateValueAndValidity();
    }
  }
  getPostalAdd(code: any) {
    if (this.selectedDialCode === 'IN' && code && code > 0)
      this._authService.getPostalAddress(code).subscribe((res) => {
        if (res && res[0]?.Status === 'Success') {
          const postalJson = res[0].PostOffice[0];
          this.signUpForm
            .get('CompanyInfo.CompanyDistrict')
            ?.patchValue(postalJson?.District);
          this.signUpForm
            .get('CompanyInfo.CompanyState')
            ?.patchValue(postalJson?.State);
        } else {
          this._toaster.showErrorToast('Invalid pin code!');
          this.signUpForm
            .get('CompanyInfo.CompanyPincode')
            ?.setErrors({ error: 'Not a valid pin code.' });
        }
      });
    else {
      // this._toaster.showInfoToast('Please enter valid pin code !!');
    }
  }

  getCountry(e: any) {
    const cFound = this.dialCodes.find((el: any) => el.code === e.target.value);
    this.dialCode = cFound.dial_code;
    if (this.selectedTab === 'Corporate') {
      this.signUpForm
        .get('CompanyInfo.CompanyCountry')
        ?.patchValue(cFound?.name);
      this.signUpForm.get('CompanyInfo.CompanyPincode')?.reset();
      this.signUpForm.get('CompanyInfo.CompanyDistrict')?.reset();
      this.signUpForm.get('CompanyInfo.CompanyState')?.reset();
    }
  }
  DobValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const ageDiff =
        new Date(this.todayDate).getFullYear() - new Date(value).getFullYear();
      const monthDiff =
        new Date(this.todayDate).getMonth() - new Date(value).getMonth();
      const dayDiff =
        new Date(this.todayDate).getDate() - new Date(value).getDate();
      let isAbove18 = false;
      if (ageDiff > 18) {
        isAbove18 = true;
      } else if (ageDiff === 18) {
        if (monthDiff > 0) {
          isAbove18 = true;
        } else if (monthDiff === 0 && dayDiff >= 0) {
          isAbove18 = true;
        }
      }
      return isAbove18 ? null : { isMinor: true };
    };
  }
  getHasError(control: any) {
    return this.signUpForm.controls['Password'].hasError(control);
  }
  gstVerify(e: any) {
    const flag = this.signUpForm?.get('CompanyInfo.CompanyGST')?.valid;
    if (!flag) {
      return;
    }
    const gst = e.target.value;
    const url = `${walsonsApiEndPoint}GetGSTDetails`;
    const payload = {
      refid: gst,
      IdNo: gst,
    };
    if (gst) {
      this.gstLoading = true
      this._http.post(url, payload).subscribe(
        (res: any) => {
          this.gstLoading = false
          if (res && res.status && res?.statuscode === 200) {
            const pincode = res?.data?.address.substring(
              res?.data?.address.length - 7,
              res?.data?.address.length
            );
            this.getPostalAdd(Number(pincode));
            this.signUpForm
              .get('CompanyInfo.CompanyName')
              ?.setValue(res?.data?.legal_name);
            this.signUpForm
              .get('CompanyInfo.CompanyAddress1')
              ?.setValue(res?.data?.address);
            // this.signUpForm
            //   .get('CompanyInfo.CompanyDistrict')
            //   ?.patchValue(res?.data?.district);
            // this.signUpForm
            //   .get('CompanyInfo.CompanyState')
            //   ?.patchValue(res?.data?.state);
            this.signUpForm
              .get('CompanyInfo.CompanyPincode')
              ?.setValue(Number(pincode));
            document
              .getElementById('CompanyAddress1')
              ?.setAttribute('disabled', 'true');
            document
              .getElementById('CompanyName')
              ?.setAttribute('disabled', 'true');
            // this.signUpForm
            //   .get('CompanyInfo.CompanyName')
            //   ?.disable();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyAddress1')
            //   ?.disable();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyDistrict')
            //   ?.disable();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyState')
            //   ?.disable();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyPincode')
            //   ?.disable();
          } else {
            const fields = [
              'CompanyName',
              'CompanyAddress1',
              'CompanyDistrict',
              'CompanyState',
              'CompanyPincode',
            ];
            this._toaster.showErrorToast('No details found with this GST no.');
            this.signUpForm
              .get('CompanyInfo.CompanyGST')
              ?.setErrors({ error: 'Not a valid GST no.' });
            fields.forEach((el) => {
              this.signUpForm.get(`CompanyInfo.${el}`)?.reset();
              document.getElementById(`${el}`)?.removeAttribute('disabled');
            });
            // this.signUpForm
            //   .get('CompanyInfo.CompanyName')
            //   ?.reset();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyAddress1')
            //   ?.reset();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyDistrict')
            //   ?.reset();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyState')
            //   ?.reset();
            // this.signUpForm
            //   .get('CompanyInfo.CompanyPincode')
            //   ?.reset();
          }
        },
        (err: any) => {
          this.gstLoading = false

          this._toaster.showErrorToast('No details found with this GST no.');

          this.signUpForm.get('CompanyInfo.CompanyGST')?.setErrors({});
        }
      );
    }

    
  }
   slides = [
    {
      avatars: [
        '/assets/img/Tenant-Verification-image.png',
        '/assets/img/Self-Verification-image.png',
        '/assets/img/Banner-1.png',
      ],
      title: 'Trust every decision.',
      subtitle: 'Verify every detail.',
      desc: 'Background screening backed by Platinum verification recognition from NSR-NASSCOM.'
    },
    {
      avatars: [
        '/assets/img/Banner-2.png',
        '/assets/img/Banner-3.png',
        '/assets/img/Service-3.png'
      ],
      title: 'Smarter screens.',
      subtitle: 'Safer workplaces.',
      desc: 'Verify criminal registries, professional credentials, and employment history instantly.'
    },
    {
      avatars: [
         '/assets/img/Banner-5.png',
        '/assets/img/Banner-6.png',
        '/assets/img/Instant-Verification-image.png'
      ],
      title: 'Global compliance.',
      subtitle: 'Zero compromises.',
      desc: 'Designed to ensure security, high confidentiality, and strict adherence to data protection standards.'
    }
  ];
 
 

  currentIndex = 0;
  intervalId: any;

  showSlide(index: number) {
    this.currentIndex = index;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  startAutoRotate() {
    this.intervalId = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoRotate() {
    clearInterval(this.intervalId);
  }

}
