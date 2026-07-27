import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CartService } from 'src/app/api-services/cart.services';
import { HelperService } from 'src/app/api-services/helper.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bottom-cart-sheet',
  templateUrl: './bottom-cart-sheet.component.html',
  styleUrls: ['./bottom-cart-sheet.component.scss'],
})
export class BottomCartSheetComponent implements OnInit, AfterViewInit {
  @Output() isItemIncard = new EventEmitter<boolean>(false);
  @Output() willOpen = new EventEmitter<boolean>(false);
  isLive: boolean = true;
  AllCartItems: any[] = [];
  totalAmt: number = 0;
  isLoggedIn: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public _cart: CartService,
    private _payment: PaymentService,
    private _helper: HelperService,
    private _router: Router,
    private _toaster: ToasterService
  ) {}
  ngAfterViewInit(): void {
    // document.getElementById(`sg_btm_crt_opn`)?.addEventListener('click', () => {
    //   document.getElementById(`sg_btm_crt`)?.classList.toggle('show');
    // });
    $('#sg_btm_crt .active_crt').slideUp();
    $('#sg_btm_crt .active_not').slideDown();
    $('.sg_btom_crt_open').on('click', function () {
      $('#sg_btm_crt').toggleClass('show');
      // $(this).toggleClass('active');
      // if($('#sg_btm_crt').hasClass('show')){
      $('#sg_btm_crt .active_crt').slideToggle(700);
      // }else{
      $('#sg_btm_crt .active_not').slideToggle(700);
      // }
    });
    $('.sg_btom_crt_minimized').on('click', function () {
      $(this).toggleClass('active');

      $('.sg_btom_crt_open').toggleClass('active');
      $('.sg_btm_crt_ctn').parent('.sg_btm_cart_modal').toggleClass('m_active');
      $('.sg_btm_crt_ctn').slideToggle();
    });
  }

  ngOnInit(): void {
    this._helper.isLoggedOut
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res) {
          // this.AllCartItems = [];
          // this.totalAmt = 0;
          // this.isItemIncard.emit(false);
          this._helper.getCartItemsFromLocastorage
            .pipe(takeWhile(() => this.isLive))
            .subscribe((res: any) => {
              if (res && res.length) {
                this.AllCartItems = [];
                this.totalAmt = 0;

                this.handleLocalstorageData(res);
              } else {
                this.AllCartItems = [];
                this.totalAmt = 0;
                this.isItemIncard.emit(false);
              }
            });
        }
      });

    if (this._helper.isLoggedIn) {
      this.isLoggedIn = true;
      this._cart.isAddedInCart
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res) => {
          if (res) this.getAllCartByUserId();
        });
      this.getAllCartByUserId();
    } else {
      // this.AllCartItems = [];
      // this.isItemIncard.emit(false);
      this._helper.getCartItemsFromLocastorage
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res: any) => {
          if (isPlatformBrowser(this.platformId) && res && res.length) {
            this.handleLocalstorageData(res);
          } else {
            this.AllCartItems = [];
            this.totalAmt = 0;
            this.isItemIncard.emit(false);
          }
        });
    }
  }
  getAllCartByUserId() {
    this._cart
      .getAllCartByUserId(1)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res && res.IsSuccess) {
          this.AllCartItems = [];
          res.Data.forEach((item: any) => {
            let pkgArr = item.ServicePackageMapping.Packages.map((el: any) => {
              if (!el.fixedpackage) {
                return {
                  ...el,
                  CartId: item.CartId,
                  totalAlaCarteAmt: el.packageServices.reduce(
                    (total: number, el: any) => {
                      return total + el.service_price;
                    },
                    0
                  ),
                };
              }
              return {
                ...el,
                CartId: item.CartId,
              };
            });

            this.AllCartItems.push(...pkgArr);
          });
          // this.AllCartItems = res.Data.map((el: any) => {
          //   if (!el.fixedpackage) {
          //     return {
          //       ...el,
          //       totalAlaCarteAmt: el.packageServices.reduce(
          //         (total: number, el: any) => {
          //           return total + el.service_price;
          //         },
          //         0
          //       ),
          //     };
          //   }
          //   return {
          //     ...el,
          //   };
          // });
          this.isItemIncard.emit(true);
          this.willOpen.emit(false);
          this.getTotalAmount();
        } else {
          this.willOpen.emit(true);
          this.AllCartItems = [];
          this.totalAmt = 0;
          this.isItemIncard.emit(false);
        }
      });
  }
  handleLocalstorageData(data: any) {
    if (data.length) {
      this.AllCartItems = [];
      this.AllCartItems = JSON.parse(data).map((el: any, i: number) => {
        return {
          ...el,
          CartId: i,
          totalAlaCarteAmt: el.packageServices.reduce(
            (total: number, el: any) => {
              return total + el.service_price;
            },
            0
          ),
        };
      });

      this.isItemIncard.emit(true);

      this.getTotalAmount();
    }
  }
  getTotalAmount() {
    this.totalAmt = 0;
    this.AllCartItems.map((el: any) => {
      // el.ServicePackageMapping.Packages.map((e: any) => {
      if (el.fixedpackage) {
        this.totalAmt += el.price;
      } else {
        el.packageServices.map((d: any) => {
          this.totalAmt += d.service_price;
        });
      }
      // });
    });
  }
  buyNow() {
    if (this._helper.isLoggedIn) {
      let payload: any = {
        amount: this.totalAmt,
        PackageId: [],
        ServiceId: [],
        PackageServiceId: [],
        CartId: [],
      };

      this.AllCartItems.map((el: any) => {
        payload.PackageId.push(el.package_id);
        payload.CartId.push(el.CartId);
        payload.ServiceId.push(el.service_id);
        payload.PackageServiceId.push(
          ...[el.packageServices.map((d: any) => d.package_service_id)]
        );
      });
      if (this._helper.getUserType == 4) {
        this._payment.createOrder(
          payload.amount,
          payload.PackageId.join(','),
          payload.ServiceId.join(','),
          payload.PackageServiceId,
          payload.CartId
        );
        // this._toaster.successAlert('Services purchased.', 0).then((result) => {
        //   if (result.isConfirmed) {
        //   }
        // });
      } else
        this._payment.createOrder(
          payload.amount,
          payload.PackageId.join(','),
          payload.ServiceId.join(','),
          payload.PackageServiceId,
          payload.CartId
        );
    } else {
      localStorage.setItem('isReadyToBuy', JSON.stringify(true));
      this._router.navigate(['/auth/login']);
    }
  }
  deleteItemCart(cartId: number) {
    Swal.fire({
      title: 'Are you sure!!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      confirmButtonText: 'Remove',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this._helper.isLoggedIn)
          this._cart
            .deleteCart(cartId, 1)
            .pipe(takeWhile(() => this.isLive))
            .subscribe((res: any) => {
              if (res && res.IsSuccess) {
                this._toaster.showSuccessToast(res.Message);

                this.getAllCartByUserId();
                this.getTotalAmount();
              } else {
                this._toaster.showErrorToast(res.Message);
              }
            });
        else this._helper.deleteItemFromStorage(cartId);
      }
    });
  }
  clearCart() {
    if (this.AllCartItems?.length) {
      Swal.fire({
        title: 'Are you sure!!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',

        confirmButtonText: 'Clear Cart',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          if (this._helper.isLoggedIn)
            this._cart
              .clearCart()
              .pipe(takeWhile(() => this.isLive))
              .subscribe((res: any) => {
                if (res && res.IsSuccess) {
                  this._toaster.showSuccessToast(res.Message);

                  this.getAllCartByUserId();
                  this.getTotalAmount();
                } else {
                  this._toaster.showErrorToast(res.Message);
                }
              });
        }
      });
      // if (confirm('Are you sure??'))
      //   this._cart
      //     .deleteCart(+this.AllCartItems.map((d: any) => d.CartId).join(','), 1)
      //     .pipe(takeWhile(() => this.isLive))
      //     .subscribe((res: any) => {
      //       if (res && res.IsSuccess) {
      //         this.getAllCartByUserId();
      //         this.getTotalAmount();
      //         // alert(res.Message);
      //       } else {
      //         alert(res.Message);
      //       }
      //     });
    }
  }
  updateCart(id: number, el: any) {
    if (id && el) {
      let pkgServiceIds = el.packageServices
        .map((d: any) => d.package_service_id)
        .filter((e: number) => e !== id)
        .join(',');
      let payload = {
        ServiceId: el.service_id,
        PackageId: el.package_id,
        PackageServiceId: pkgServiceIds,
        UserId: 1,
        CartId: el.CartId,
      };
      this._cart
        .updateCart(payload)
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res) => {
          if (res && res.IsSuccess) {
            this.getAllCartByUserId();
            this._toaster.showSuccessToast('Cart updated successfully.');
          } else {
            this._toaster.showErrorToast(res.Message);
          }
        });
    }
  }
}
