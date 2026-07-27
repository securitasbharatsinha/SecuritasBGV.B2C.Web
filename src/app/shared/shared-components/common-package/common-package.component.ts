import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { take, takeWhile } from 'rxjs/operators';
import { CartService } from 'src/app/api-services/cart.services';
import { HelperService } from 'src/app/api-services/helper.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-common-package',
  templateUrl: './common-package.component.html',
  styleUrls: ['./common-package.component.scss'],
})
export class CommonPackageComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() data: any;
  isAddedCart: boolean = false;
  totalAmt: number = 0;
  alaCartePackage: any;
  item = {
    packageServices: [],
  };
  isLive: boolean = true;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _payment: PaymentService,
    private _cart: CartService,
    private _helper: HelperService,
    private _router: Router,
    private _toaster: ToasterService
  ) {}
  ngAfterViewInit(): void {
    if (this.data && this.data.every((d: any) => d.service_id === 5)) {
      this.data.forEach((el: any, i: number) => {
        document
          .getElementById(`optionBtn${i}`)
          ?.addEventListener('click', () => {
            document
              .getElementById(`optionDiv${i}`)
              ?.classList.toggle('active');
          });
      });
    }
  }
  ngOnDestroy(): void {
    this.isLive = false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.customize_action();
    }
    if (this.data) {
      this.data = this.data.map((el: any) => {
        let pack = el.packageServices.map((d: any) => {
          return {
            ...d,
            isSelected: false,
            oldPrice: d.service_price,
            isFixedSelected: true,
          };
        });
        return {
          ...el,
          packageServices: pack,
          isSelected: false,
          alaCarte: {
            serviceIds: [],
            pkgId: 0,
          },
        };
      });

      if (this.data.every((d: any) => d.service_id === 5)) {
        let optionalPack = this.data.find((el: any) => !el.fixedpackage);
        this.data = this.data
          // .filter((el: any) => el.fixedpackage)
          .map((d: any) => {
            return {
              ...d,
              isSelected: false,
              options: { ...optionalPack },
            };
          });
      }

      this.alaCartePackage = this.data.filter((el: any) => !el.fixedpackage);
    }
  }

  customize_action() {
    var tempThis = this;
    $('.sg_custome_checks_div').hide();
    $('.sg_show_cstm_checks').on('click', function () {
      $(this).siblings('.sg_custome_checks_div').slideToggle(800);
      $(this).toggleClass('active');
    });
    $('.sg_custome_checks_div').hide();
    $('.sg_show_cstm_checks').on('click', function () {
      $(this).siblings('.sg_custome_checks_div').slideToggle(800);
      $(this).toggleClass('active');
    });
  }

  incrementValue(e: any, qty: any, item: any, indx: number) {
    if (++qty > 0) {
      e.preventDefault();
      var fieldName = $(e.target).data('field');
      var parent = $(e.target).closest('div.sg_input-group');
      var val = parent
        .find('input[name=' + fieldName + ']')
        .val()
        ?.toString();
      if (val) var currentVal = parseInt(val, 10);
      else var currentVal = 0;
      if (!isNaN(currentVal)) {
        parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
      } else {
        parent.find('input[name=' + fieldName + ']').val(0);
      }
      this.setQtyInService(qty, item, indx);
    }
  }

  decrementValue(e: any, qty: any, item: any, indx: number) {
    if (--qty > 0) {
      e.preventDefault();
      var fieldName = $(e.target).data('field');
      var parent = $(e.target).closest('div');
      var val = parent
        .find('input[name=' + fieldName + ']')
        .val()
        ?.toString();
      if (val) var currentVal = parseInt(val, 10);
      else var currentVal = 0;

      if (!isNaN(currentVal) && currentVal > 0) {
        parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
      } else {
        parent.find('input[name=' + fieldName + ']').val(0);
      }
      this.setQtyInService(qty, item, indx);
    }
  }
  setQtyInService(qty: any, item: any, indx: number) {
    if (qty > 0) {
      this.data[0].packageServices[indx].service_price = +item.oldPrice * qty;
      this.data[0].packageServices[indx].qty = qty;
    }
  }
  goToCart() {}
  selectService($event: any) {}

  buyNow(item: any = null) {
    if (this._helper.isLoggedIn) {
      if (item)
        this._payment.createOrder(
          item.price,
          item.package_id,
          item.service_id,
          item.packageServices.map((d: any) => d.package_service_id)
        );
    } else {
      this.openAlert();
    }
  }
  buyNowAla(item: any) {
    if (item && item.packageServices.some((el: any) => el.isSelected)) {
      item.isSelected = true;
      if (item.packageServices.some((el: any) => el.qty)) {
        let newItem = {
          ...item,
          packageServices: item.packageServices
            .filter((el: any) => el.isSelected)
            .map((d: any) => {
              return {
                ...d,
                package_service_id: Array(d.qty).fill(d.package_service_id),
              };
            }),
        };
        this.addItemToCart(newItem);
      } else {
        this.addItemToCart({
          ...item,
          packageServices: item.packageServices.filter(
            (el: any) => el.isSelected
          ),
        });
      }

      // this._payment.createOrder(
      //   this.totalAmt,
      //   item.package_id,
      //   item.service_id,
      //   item.packageServices
      //     .filter((el: any) => el.isSelected)
      //     .map((d: any) => d.package_service_id)
      // );
    } else {
      this.openAlert('Please choose any service!!', 'info');
    }
  }
  selectInCart(
    i: number,
    price: number,
    item: any = null,
    pkgServiceId: number,
    el: any,
    pkgIn: number
  ) {
    // if (this._helper.isLoggedIn) {
    if (item) {
      this.data[pkgIn].packageServices[i].isSelected = true;
      this.totalAmt += price;

      return;
      this.addItemToCart(
        {
          ...item,
        },
        true,
        el.qty
          ? Array(el.qty).fill(pkgServiceId).join(',')
          : pkgServiceId.toString()
      );
    }
    // } else {
    //   this.openAlert();
    // }
  }
  setIcon(pkg: string) {
    switch (pkg) {
      case 'Domestic Helper':
        return '/assets/icons/domestic_helper.png';

      case 'Baby Sitter / Elderly Care Taker':
        return '/assets/icons/baby_sitter.png';

      case 'Driver':
        return '/assets/icons/driver.png';

      case 'Tution Teacher':
        return '/assets/icons/tution_teacher.png';

      case 'À la carte':
        return '/assets/icons/alacarte.png';

      case 'Tenant Verification':
        return '/assets/icons/tenant.png';

      default:
        return '/assets/icons/alacarte.png';
    }
  }

  addItemToCart(item: any, flag: boolean = false, pkgServiceId: any = null) {
    if (item) {
      item.isSelected = true;
      if (this._helper.isLoggedIn) {
        if (item) {
          // item.isSelected = true;
          const payload = {
            UserId: this._helper.getUserId,
            ServiceId: item.service_id,
            PackageId: item.package_id,
            PackageServiceId:
              flag && pkgServiceId
                ? pkgServiceId
                : item.packageServices
                    .map((d: any) => d.package_service_id)
                    .join(','),
          };
          this.callApiAddTocart(payload);
        }
        if (
          item &&
          item.alaCarte &&
          item.alaCarte.pkgId &&
          item.alaCarte.serviceIds?.length
        ) {
          const payload = {
            ServiceId: item.service_id,
            PackageId: item.alaCarte.pkgId,
            PackageServiceId: item.alaCarte.serviceIds.join(','),
            UserId: this._helper.getUserId,
          };
          this.callApiAddTocart(payload);
        }
      } else {
        // this.openAlert();
        this._helper.localStorageHandler(item);
      }
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
          localStorage.removeItem('isReadyToBuy');
          localStorage.removeItem('cartItems');
        } else {
          this._toaster.showErrorToast(res.Message);
        }
      });
  }
  addPkgToCart(item: any) {
    if (this._helper.isLoggedIn) {
      item.isSelected = true;
    }
    this.openAlert();
  }
  selectCustomizeOptions(
    event: any,
    option: any,
    optionIndx: number,
    pkg: any,
    pkgIndx: number
  ) {
    if (event.target.checked) {
      this.data[pkgIndx].price += option.service_price;
      // this.data[pkgIndx].packageServices.push({ ...option });
      this.data[pkgIndx].alaCarte.serviceIds.push(option.package_service_id);
      this.data[pkgIndx].alaCarte.pkgId = option.package_master_id;
    } else {
      this.data[pkgIndx].price -= option.service_price;
      // this.data[pkgIndx].packageServices.splice(
      //   this.data[pkgIndx].packageServices.findIndex(
      //     (el: any) => el.package_service_id === option.package_service_id
      //   ),
      //   1
      // );
      this.data[pkgIndx].alaCarte.serviceIds.splice(
        this.data[pkgIndx].alaCarte.serviceIds.findIndex(
          (el: any) => el === option.package_service_id
        ),
        1
      );
    }
  }
  getQntyOfServices(event: any, item: any) {
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
      // hideClass: {
      //   popup: 'animate__animated animate__fadeOutUp',
      // },
    }).then((result) => {
      if (result.isConfirmed) {
        if (title) {
        } else {
          this._router.navigate(['/auth']);
        }
      }
    });
  }
  setTotalForFixedpackages(id: number) {
    const obj = this.data.find((d: any) => d.package_id === id);
    const total = obj.packageServices
      .filter((d: any) => d.isFixedSelected)
      .reduce((total: number, el: any) => {
        return total + el.service_price;
      }, 0);

    return total;
  }
}
