import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CartService } from 'src/app/api-services/cart.services';
import { HelperService } from 'src/app/api-services/helper.services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'diligence-form',
  templateUrl: './diligence-form.component.html',
  styleUrls: ['./diligence-form.component.scss'],
})
export class DiligenceFormComponent implements OnInit, OnChanges {
  @Input() checkDetails: any;
  @Input() pkgDetails: any;
  @Input() PkgName: string;
  actionForm: FormGroup;
  // phonePattern = '((([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4})';
  // emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$';
  isLive: boolean = true;
  CheckInfo: any;
  checkForm: any;
  serviceId: number;
  selectedDialCode: string = 'IN';
  dialCodes: any;
  dialCode: string = '+91';
  user: any;
  tempDialCode: any;
  tempSelectedDialCode: any;
  userRoleId: number;
  serviceType: any;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _fb: FormBuilder,
    private _toaster: ToasterService,
    private _helper: HelperService,
    private _router: Router,
    private _home: HomePageService,
    private _cart: CartService
  ) {
      this.actionForm = this._fb.group({
            EnquiryId: [0],
      
            Name: ['',
              [
                Validators.required,
                Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$'),
                Validators.minLength(3),
                Validators.maxLength(30),
              ],
            ],
            MobileNumber: [
              '',
              [
                Validators.required,
                Validators.pattern('^[6-9][0-9]{9}$'),
              
              ],
            ],
            EmailId: [
              '',
              [
                Validators.required,
                Validators.email,
                Validators.pattern(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]@)[a-zA-Z0-9._-]+@(?![.-])(?!.*[.-]{2})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
              ],
            ],
            Description: ['', Validators.required],
          });
    }
 
  onNameInput(event: any) {
    let value = event.target.value;
  
    // Allow only alphabets & space
    value = value.replace(/[^a-zA-Z ]/g, '');
  
    // Remove multiple spaces
    value = value.replace(/\s+/g, ' ');
  
    // Trim left space
    value = value.replace(/^\s+/, '');
  
    // Capitalize each word
    value = value
      .split(' ')
      .map((word: string) =>
        word ? word[0].toUpperCase() + word.substring(1).toLowerCase() : ''
      )
      .join(' ');
  
    this.actionForm.controls['Name'].setValue(value, { emitEvent: false });
  } 
  ngOnChanges(changes: SimpleChanges): void {
    if ('checkDetails' in changes) {
      if (changes.checkDetails.currentValue) {
        this.serviceType = changes.checkDetails.currentValue;
        this.loadData(changes.checkDetails.currentValue);
      }
    }
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
    this.userRoleId = Number(this._helper.getUserType);
    this.fetch((data: any) => {
      this.dialCodes = data;
      // this.patchValues();
    });
    this._helper.isLoggedIn &&
      this._helper.uDetails?.subscribe((res: any) => {
        this.user = res;
        // this.user && this.dialCodes && this.patchValues();
      });
  }
  patchValues() {
    if (this.user && this.dialCodes) {
      // const Code = this.dialCodes?.find(
      //   (el: any) => el.dial_code == this.user.Phone.split('-')[0]
      // );

      // this.tempDialCode = Code?.dial_code;
      // this.tempSelectedDialCode = Code?.code;
      // this.selectedDialCode = Code?.code;
      // this.dialCode = Code?.dial_code;

      this.actionForm.patchValue({
        Name: `${this.user.Prefix} ${this.user.FName} ${this.user.MName} ${this.user.LName} `,
        // Phone: Number(this.user.Phone?.split('-')[1]),
        MobileNumber: Number(this.user.Phone),

        EmailId: this.user.Email,
      });
    }
  }
  loadData(serviceType: any) {
    if (serviceType) {
      this.serviceId = serviceType.servicetype_id;
      this._home
        .getServiceById(serviceType.servicetype_id)
        .pipe(takeWhile(() => this.isLive))
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess) {
              //@ts-ignore
              const pkgDetails = res.Data.map((el: any) => {
                return el.packageServices.find((d: any) =>
                  d.service_name.toLowerCase().includes(this.PkgName)
                );
              });
              this.CheckInfo = pkgDetails[0];
            } else {
            }
          },
          (err: any) => {
          }
        );
    }
  }
  enqSubmit() {
    this.isLoading = true;
    // this._helper.isLoggedIn
    this.isSubmitted = true;
    if (true) {
      if (this.actionForm.valid) {
        const data = {
          ...this.actionForm.value,
          ServiceId: this.serviceId,
          // CreatedBy: Number(this._helper.getUserId),
        };
        this._cart
          .postEnquiry(data)
          .pipe(takeWhile(() => this.isLive))
          .subscribe((res) => {
            if (res && res.is_success) {
              this.isLoading = false;
              this.actionForm.reset();
              this.isSubmitted = false;
              this.openAlert('Your query has been registered!');
            } else {
              this._toaster.showErrorToast(res?.ex_message);
              this.isLoading = false;
            }
          });
      } else {
        this.actionForm.markAllAsTouched();
        this.isLoading = false;
      }
    } else {
      this.openAlert();
    }
  }
  submit() {
    if (this._helper.isLoggedIn) {
      if (this.actionForm.valid) {
        if (isPlatformBrowser(this.platformId)) {
          let indx = 1;
          let value;
          do {
            value = window.localStorage.getItem(
              `${this.CheckInfo.package_service_id}+${indx}`
            );
            if (value) {
              indx++;
            } else {
              const data = {
                value: {
                  ...this.actionForm.value,
                  // Phone: `${this.dialCode}-${this.actionForm.controls.Phone.value}`,
                  Phone: `${this.actionForm.controls.Phone.value}`,
                },
                checkInfo: this.CheckInfo,
              };
              window.localStorage.setItem(
                `${this.CheckInfo.package_service_id}+${indx}`,
                JSON.stringify(data)
              );
            }
          } while (value);
          this._toaster.showSuccessToast('Your query has been registered!');
          this.addItemToCart(this.CheckInfo);
        }

        this.actionForm.reset();
        // this.selectedDialCode = this.tempSelectedDialCode;
        // this.dialCode = this.tempDialCode;
      } else {
        this.actionForm.markAllAsTouched();
      }
    } else {
      this.openAlert();
    }
  }
  openAlert(title?: string, icon1?: string) {
    Swal.fire({
      title: title ? title : 'Please Login to continue !!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      confirmButtonText: title ? 'Ok' : 'Login',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (title) {
        } else {
          this._router.navigate(['/auth']);
        }
      } else {
      }
    });
  }

  addItemToCart(item: any) {
    if (this._helper.isLoggedIn) {
      if (item) {
        const payload = {
          UserId: this._helper.getUserId,
          ServiceId: this.serviceId,
          PackageId: item.package_master_id,
          PackageServiceId: item.package_service_id,
        };
        this.callApiAddTocart(payload);
      }
    } else {
      this.openAlert();
    }
  }
  callApiAddTocart(payload: any) {
    this._cart
      .addToCart(payload)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res && res.IsSuccess) {
          this._cart.isAddedInCart.next(true);
          this._toaster.showSuccessToast(res.Message);
        } else {
          this._toaster.showErrorToast(res.Message);
        }
      });
  }
  unableType(e: Event) {
    if (!this._helper.isLoggedIn) {
      e.preventDefault()
    }
  }
  checkLoggedIn(flag: boolean, event: any = null) {
    const isTouched = event.target.classList.contains('ng-touched');
    if (!this._helper.isLoggedIn) {
      !isTouched && this.openAlert();
      return;
    } else {
    }
  }

  getCountry(e: any) {
    const Code = this.dialCodes.find((el: any) => el.code === e.target.value);
    this.dialCode = Code?.dial_code;
    this.selectedDialCode = Code?.code;
  }
  askForSignup() {
    if (!this._helper.isLoggedIn) {
      this.openAlert('');
      return;
    }
    let title = '';
    this.userRoleId === 2 && (title = 'Please login as Corporate !!');
    this.userRoleId === 4 && (title = 'Please login as Individual !!');
    this.userRoleId === 1 && (title = 'Go to admin Portal !!');
    this._helper.askForSignup(this.userRoleId, title);
  }

  onInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.actionForm.controls['MobileNumber'].setValue(value, { emitEvent: false });
    event.target.value = value;
  }

}
