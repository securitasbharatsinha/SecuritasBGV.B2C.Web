import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';

import { takeWhile } from 'rxjs/operators';
import {
  singlePackage,
  packages,
  buyPackages,
} from 'src/app/api-interfaces/home-page';
import { AuthService } from 'src/app/api-services/auth.services';
import { CartService } from 'src/app/api-services/cart.services';
import { HelperService } from 'src/app/api-services/helper.services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import {
  RAZORPAY_KEY_ID,
  RAZORPAY_SECRET_KEY,
} from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var Razorpay: any;
@Component({
  selector: 'app-shared-packages',
  templateUrl: './shared-packages.component.html',
  styleUrls: ['./shared-packages.component.scss'],
})
export class SharedPackagesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() serviceTypeId: number | null;
  @Input() calledFromPage: string | '';
  packagesList: singlePackage[] | null;
  isLive: boolean = true;
  totalServiceAmount: number = 0;
  selectedServicesId: number[] = [];
  RazorPayKeyId = RAZORPAY_KEY_ID;
  RazorPaySecretKey = RAZORPAY_SECRET_KEY;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _homepageService: HomePageService,
    private _router: Router,
    private _auth: AuthService,
    private _helper: HelperService,
    private _payment: PaymentService,
    private _cart: CartService,
    private _toaster: ToasterService
  ) {}
  ngOnDestroy(): void {
    this.isLive = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if ('serviceTypeId' in changes) {
    //   this.serviceTypeId = changes.serviceTypeId.currentValue;
    //   this.loadAllData();
    // }
  }

  ngOnInit(): void {
    this.loadAllData();
  }
  loadAllData() {
    this._homepageService
      .getAllPackagesList()
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (res: packages | null) => {
          if (res && res.IsSuccess) {
            //@ts-ignore
            this.packagesList = res?.Data?.filter(
              //@ts-ignore
              (el) => el?.service_id === 5
            ).filter((el, i) => i <= 2);
          }
        },
        (err: any) => {
        }
      );
    // if (this.serviceTypeId)
    //   this._homepageService
    //     .getServiceById(this.serviceTypeId)
    //     .pipe(takeWhile(() => this.isLive))
    //     .subscribe(
    //       (res: packages | null) => {
    //         //@ts-ignore
    //         this.packagesList = res?.Data;
    //       },
    //       (err: any) => {
    //       }
    //     );
  }
  selectService($event: any, isChecked: boolean) {
    if (isChecked) {
      this.totalServiceAmount += Number($event.target.value);
      this.selectedServicesId.push($event.target.id);
    } else {
      this.totalServiceAmount -= Number($event.target.value);
      this.selectedServicesId.splice(
        this.selectedServicesId.findIndex((d) => $event.target.id == d),
        1
      );
    }
  }
  buyServicepackages(id: number, price: number, isFixed: boolean) {
    const req: buyPackages = {
      PkgId: id,
      PkgSerId: !isFixed ? this.selectedServicesId.join(',') : null,
      TotalPrice: !isFixed ? this.totalServiceAmount : price,

      userDetails: {
        Id: Number(
          localStorage.getItem('isLoggedIn') === 'true'
            ? localStorage.getItem('userId')
            : null
        ),
      },
    };
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this._homepageService
        .buyServicePackages(req)
        .pipe(takeWhile(() => this.isLive))
        .subscribe(
          (res: any) => {},
          (err: any) => {
          }
        );
    } else {
      localStorage.setItem('isPackageSelected', 'true');
      localStorage.setItem('selectedPackage', JSON.stringify(req));
      this._router.navigate(['/auth']);
    }
  }

  callApiAddTocart(item: any) {
    if (item) {
      const payload = {
        ServiceId: item.service_id,
        PackageId: item.package_id,
        PackageServiceId: item.packageServices
          .map((d: any) => d.package_service_id)
          .join(','),
        UserId: this._helper.getUserId,
      };
      if (this._helper.isLoggedIn) {
        this._cart
          .addToCart(payload)
          .pipe(takeWhile(() => this.isLive))
          .subscribe((res) => {
            if (res && res.IsSuccess) {
              this._cart.isAddedInCart.next(true);
              this._toaster.showSuccessToast(res.Message);
              localStorage.removeItem('isReadyToBuy');
              localStorage.removeItem('cartItems');
            } else {
              this._toaster.showErrorToast(res.Message);
            }
          });
      } else {
        this.openAlert();
        // if (isPlatformBrowser(this.platformId)) {
        //   this._helper.localStorageHandler(item);
        // }
      }
    }
  }
  openAlert() {
    Swal.fire({
      title: 'Please Login to continue !!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      // hideClass: {
      //   popup: 'animate__animated animate__fadeOutUp',
      // },
      confirmButtonText: 'Login',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this._router.navigate(['/auth']);
      }
    });
  }
}
