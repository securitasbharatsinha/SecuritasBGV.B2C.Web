import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval, of } from 'rxjs';
import { debounce, take, takeWhile } from 'rxjs/operators';
import { CartService } from 'src/app/api-services/cart.services';
import { HelperService } from 'src/app/api-services/helper.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { getPortalPath, postpaidUsers } from 'src/environments/environment';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Component({
  selector: 'app-shared-cart',
  templateUrl: './shared-cart.component.html',
  styleUrls: ['./shared-cart.component.scss'],
  providers: [DatePipe],
})
export class SharedCartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('code') code: HTMLInputElement;
  @Output() isItemIncard = new EventEmitter<boolean>(false);
  @Output() willOpen = new EventEmitter<boolean>(false);
  isLive: boolean = true;
  AllCartItems: any;
  totalAmt: number = 0;
  cartAmt: number = 0;
  obs: Subscription;
  isWalletSelected: boolean = false;
  walletBalance: any;
  walletpayReq: any;
  remainBalance: number;
  isCodeExpired: boolean;
  discountAmt: number;
  codeApplied: boolean;
  noPromoCode: boolean;
  promoCodeDetails: any;
  promoCode: string;
  gst: number;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public _cart: CartService,
    private _payment: PaymentService,
    public _helper: HelperService,
    private _router: Router,
    private _toaster: ToasterService,
    private http: HttpClient,
    private _datePipe: DatePipe
  ) {}
  ngOnDestroy(): void {
    // this.obs.unsubscribe();
    this.isLive = false;
  }
  ngAfterViewInit(): void {}

  async loadRazorpay() {
    if (!window['Razorpay']) {
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    }
  }

  ngOnInit(): void {
    // this.fetchOrders()
    this._helper.isLoggedOut
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res) {
          // this.AllCartItems = null;
          // this.totalAmt = 0;
          // this.isItemIncard.emit(false);
          this._helper.getCartItemsFromLocastorage
            .pipe(takeWhile(() => this.isLive))
            .subscribe((res: any) => {
              if (res && res.length) {
                this.isItemIncard.emit(true);
              } else {
                this.AllCartItems = null;
                this.totalAmt = 0;
                this.isItemIncard.emit(false);
              }
            });
        }
      });

    if (this._helper.isLoggedIn) {
      this._cart.isAddedInCart
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res) => {
          if (res) this.getAllCartByUserId();
        });
      this.getAllCartByUserId();
    } else {
      this.AllCartItems = null;
      // // this.isItemIncard.emit(false);
      this._helper.getCartItemsFromLocastorage
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res: any) => {
          if (isPlatformBrowser(this.platformId) && res && res.length) {
            this.isItemIncard.emit(true);
          } else {
            this.isItemIncard.emit(false);
          }
        });
    }
    //wallet details
    // this._payment._WalletDetails
    //   .pipe(takeWhile(() => this.isLive))
    //   .subscribe((res) => {
    //     if (res && res.is_success) {
    //       this.walletBalance = res.data[0]?.AvailableBalance ?? 0;
    //     }
    //   });
    // pay without wallet
    this._payment.payWithoutWallet
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res: any) => {
        if (res && res.pay) {
          this._payment.payWithoutWallet.next({ pay: false });
          this.payViaWallet();
        }

        // if (res && res.pay && !this.isWalletSelected) {
        //   this.payViaWallet();
        // }
        // if (res && res.pay && this.isWalletSelected && this.remainBalance > 0) {
        //   this.payViaWallet();
        // }
      });
  }
  getAllCartByUserId() {
    this._cart
      .getAllCartByUserId(1)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res && res.IsSuccess) {
          this._cart.CartDetails = res.Data;
          // this.AllCartItems = res.Data;
          this.isItemIncard.emit(true);

          this.reduceData(res.Data);
          this.getTotalAmount();
          if (isPlatformBrowser(this.platformId)) {
            $('.sg_cart_modal').removeClass('active');
            $('.sg-cart-mdl').removeClass('active');
            $('.sg_cart_modal').toggleClass('active');
            $('.sg-cart-mdl').toggleClass('active');
          }
        } else {
          this.AllCartItems = null;
          this.totalAmt = 0;
          this.isItemIncard.emit(false);
          this.willOpen.emit(true);
        }
      });
  }
  getTotalAmount() {
    this.totalAmt = 0;
    this.AllCartItems = this.AllCartItems.map((el: any) => {
      let singleCartAmt = 0;
      el.checksArr.map((e: any) => {
        this.totalAmt += e.new_price;
        singleCartAmt = singleCartAmt + e.new_price;
        // if (e.fixedpackage) {
        //   this.totalAmt += e.price;
        // } else {
        //   e.packageServices.map((d: any) => {
        //     this.totalAmt += d.service_price;
        //   });
        // }
      });
      return {
        ...el,
        singleCartAmt: singleCartAmt,
      };
    });
    this.cartAmt = this.totalAmt;
    this.gst = this.cartAmt * (18 / 100);
    this.totalAmt = this.cartAmt + this.gst;
    this.discountAmt = 0;
    this.promoCodeDetails = null;
    this.codeApplied = false;
    this.promoCode = '';
  }
  async buyNow() {
    await this.loadRazorpay();

    if (this._helper.isLoggedIn) {
      !this.AllCartItems?.length && this._router.navigate(['/services']);
    } else {
      this._router.navigate(['/auth/login']);
      return;
    }
    const userCatgeory = this._helper.getUserCategory;
    const userType = Number(this._helper.getUserType);
    let payload: any = {
      amount: this.totalAmt,
      PackageId: [],
      ServiceId: [],
      PackageServiceId: [],
      CartId: [],
    };
    this.AllCartItems?.map((el: any) => {
      payload.PackageId.push(el.PackageId);
      payload.CartId.push(el.CartId);
      payload.ServiceId.push(el.ServiceId);
      payload.PackageServiceId.push(...this.getIds(el.checksArr));
    });
    if (
      postpaidUsers.includes(userType) &&
      postpaidUsers.includes(userCatgeory)
    ) {
      const user = this._helper.user;
      let order = {
        cartReq: {
          ServiceId: 0,
          PackageId: 0,
          PackageServiceId: 0,
          UserId: Number(user.Id),
          CartId: payload.CartId.join(','),
        },
        PaymentReq: {
          tokenId: '100001010101ffff',
          userId: Number(user.Id),
          username: user.FName + ' ' + user.LName,
          email: user.Email,
          contact: user.Phone,
          address: user.Address1 || '-',
          amount: Math.round(payload.amount * 100),
          ServiceId: payload.ServiceId.join(','),
          PackageId: payload.PackageId.join(','),
          PackageServiceId: payload.PackageServiceId.join(','),
        },
      };

      this._payment
        .createPostpaidOrder(order)
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res: any) => {
          if (res && res.is_success) {
            this._toaster.showSuccessToast('Order created successfully !!');
            this._payment.SubmitForm({ order_id: res.data.orderId });
            window.location.href = getPortalPath(res?.data.orderId);
          }
        });
    } else {
      const user = this._helper.user;
      // this.walletpayReq = {
      //   username: user.FName + ' ' + user.LName,
      //   email: user.Email,
      //   contact: user.Phone,
      //   address: user.Address1 || '-',
      //   amount: Math.round(payload.amount * 100),
      //   CartId: payload.CartId.join(','),
      //   ServiceId: payload.ServiceId.join(','),
      //   PackageId: payload.PackageId.join(','),
      //   PackageServiceId: payload.PackageServiceId.join(','),
      //   Description: 'Buy Checks',
      //   CandidateId: 0,
      // };
      this.walletpayReq = this.AllCartItems.map((el: any) => {
        return {
          username: user.FName + ' ' + user.LName,
          email: user.Email,
          contact: user.Phone,
          address: user.Address1 || '-',
          amount: Math.round(el.singleCartAmt * 100),
          CartId: el?.CartId,
          ServiceId: el?.ServiceId,
          PackageId: el?.PackageId,
          PackageServiceId: el?.PackageServiceId,
          // Description: 'Buy Checks',
          Description: 'Employee Verification',
          CandidateId: 0,
        }
      })
      this.addWallet();

      // if (this.isWalletSelected) {
      //   this.remainBalance = this.totalAmt - this.walletBalance / 100;
      //   this.walletBalance >= this.totalAmt * 100
      //     ? this.payViaWallet()
      //     : this.addWallet({ amt: this.remainBalance });
      // } else {
      //   // this._payment.createOrder(
      //   //   payload.amount,
      //   //   payload.PackageId.join(','),
      //   //   payload.ServiceId.join(','),
      //   //   payload.PackageServiceId,
      //   //   payload.CartId
      //   // );
      //   this.addWallet();
      // }
    }
  }
  payViaWallet() {
    this._payment
      .payViaWallet(this.walletpayReq)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res: any) => {
        if (res && res.is_success) {
          this.walletpayReq = null;
          this.getAllCartByUserId();
        }
      });
  }
  addWallet(requried: any = null) {
    const user = this._helper.user;
    // RequestAmt: Math.round(
    //   (requried && requried.amt ? requried.amt : this.totalAmt) * 100
    // ),
    const req = {
      Name: user.FName + ' ' + user.LName,
      Email: user.Email,
      Contact: user.Phone,
      Address: user.Address1 || '-',
      // RequestAmt: Math.round(
      //   (this.totalAmt) * 100
      // ),

      description: 'Requested Amount',
    };
    const newReq = this.AllCartItems.map((el: any) => {
      let taxAmt = el?.singleCartAmt * (18 / 100);
      let amt = this.cartAmt - this.discountAmt;
      let disPer: any = Math.abs(((amt / this.cartAmt) * 100) - 100);
      let disAmt = el?.singleCartAmt - (el?.singleCartAmt * disPer / 100);
      return {
        CartId: el?.CartId,
        RequestAmt: Math.round((disAmt + taxAmt) * 100),
        ...req,
      };
    });
    this._payment
      .addWallet(newReq)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res && res.is_success) {
          const promoCodeData = {
            Orderid: res?.data?.OrderId,
            Amt: this.cartAmt,
            Toamount: this.totalAmt,
            Codeapplicable: true,
            Copencodevalue: this.promoCodeDetails?.promcode,
            Finalvalue: this.totalAmt,
            Status: '1',
            createdate: null,
            Percentages: '10%',
          };
          this._payment.payWalletNow(res.data, promoCodeData);
        }
      });
  }
  getIds(arr: any) {
    let ids: any = [];
    arr.map((e: any) => {
      ids.push(...Array(e.qty).fill(e.package_service_id));
    });
    return ids;
  }
  // buyNow() {
  //   let payload: any = {
  //     amount: this.totalAmt,
  //     PackageId: [],
  //     ServiceId: [],
  //     PackageServiceId: [],
  //     CartId: [],
  //   };
  //   this.AllCartItems.map((el: any) => {
  //     payload.PackageId.push(el.PackageId);
  //     payload.CartId.push(el.CartId);
  //     payload.ServiceId.push(el.ServiceId);
  //     payload.PackageServiceId.push(...[el.PackageServiceId]);
  //   });
  //   this._payment.createOrder(
  //     payload.amount,
  //     payload.PackageId.join(','),
  //     payload.ServiceId.join(','),
  //     payload.PackageServiceId,
  //     payload.CartId
  //   );
  // }
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
        this._cart
          .deleteCart(cartId, 1)
          .pipe(takeWhile(() => this.isLive))
          .subscribe((res: any) => {
            if (res && res.IsSuccess) {
              this.getAllCartByUserId();
              this.getTotalAmount();
              // alert(res.Message);
            } else {
              alert(res.Message);
            }
          });
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
    }
  }
  updateCart(id: number = 0, el: any, flag: number) {
    if (el) {
      let pkgServiceIds;
      if (flag) {
        pkgServiceIds = this.getIds(el.checksArr).join(',');
      } else {
        pkgServiceIds =
          id &&
          el.checksArr
            .map((d: any) => d.package_service_id)
            .filter((e: number) => e !== id)
            .join(',');
      }

      let payload = {
        ServiceId: el.ServiceId,
        PackageId: el.PackageId,
        PackageServiceId: pkgServiceIds,
        UserId: el.UserId,
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
  reduceData(Data: any) {
    this.AllCartItems = Data.map((ell: any) => {
      let v = ell.ServicePackageMapping.Packages[0].packageServices;
      let arr: any = [];
      v.map((el: any) => {
        let f = arr.find(
          (e: any) => e.package_service_id === el.package_service_id
        );
        el.qty = 0;
        if (f) {
          f.qty++;
          f.new_price = f.service_price * f.qty;
        } else {
          el.qty++;
          el.cartId = ell.CartId;
          el.new_price = el.service_price;
          arr.push(el);
        }
      });
      return {
        ...ell,
        checksArr: arr,
      };
    });
  }
  incrementValue(
    e: any,
    qty: any,
    item: any,
    indx: number,
    ind: number,
    allChecks: any
  ) {
    if (++qty > 0 && item.Ismultiple) {
      e.preventDefault();
      this.AllCartItems[indx].checksArr[ind].qty = item.Ismultiple ? qty : 1;
      this.AllCartItems[indx].checksArr[ind].new_price =
        qty * item.service_price;

      // this.getTotalAmount();
      this.obs = of(qty)
        .pipe(debounce(() => interval(500)))
        .subscribe((data) => {
          this.updateCart(0, allChecks, 1);
        });
      // this.updateCart(0, allChecks, 1);
    }
  }

  decrementValue(
    e: any,
    qty: any,
    item: any,
    indx: number,
    ind: number,
    allChecks: any
  ) {
    if (--qty > 0) {
      e.preventDefault();
      this.AllCartItems[indx].checksArr[ind].qty = qty;
      this.AllCartItems[indx].checksArr[ind].new_price =
        qty * item.service_price;
      // this.getTotalAmount();
      this.obs = of(qty)
        .pipe(debounce(() => interval(500)))
        .subscribe((data) => {
          this.updateCart(0, allChecks, 1);
        });

    }
  }
  // doDisable(isMultiple: boolean, val: string) {
  //   return !isMultiple && +val === 1;
  // }
  doDisable(isMultiple: boolean, val: any, max: any) {
    if(!isMultiple){
      if(val <= 0) return false;
      else return true;
    } 
    else{
      if(val >= max) return true;
      else if(val < max) return false;
      else return true;
    }
  }
  openAlert() {
    Swal.fire({
      title: 'Are you sure!!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.buyNow();
      }
    });
  }

  fetchOrders() {
    const RAZORPAY_KEY_ID = 'rzp_test_VGvtRbPgI151iI';
    const RAZORPAY_SECRET_KEY = 'vCQtjCmHPh1BRR1kNqC5vQK4';
    const keyId = RAZORPAY_KEY_ID;
    const keySecret = RAZORPAY_SECRET_KEY;
    const count = 2;
    const skip = 1;
    // const url = `https://api.razorpay.com/v1/orders?count=${count}&skip=${skip}`;
    const url = `https://api.razorpay.com/v1/payments/Payment_44863394`;
    // Set up basic authentication header
    const authHeader = 'Basic ' + btoa(`${keyId}:${keySecret}`);
    this.http.get(url, { headers: { Authorization: authHeader } }).subscribe(
      (data) => {
      },
      (error) => {
      }
    );
  }

  checkCode(e: any) {
    this.promoCodeDetails = null;
    this.isCodeExpired = false;
    this.codeApplied = false;
    this.noPromoCode = false;
    const code = e;
    if (code && !this.codeApplied) {
      this._cart
        .checkPromoCode({ code: code, Amt: this.cartAmt })
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res) => {
          if(res && res.is_success && res?.data?.DiscountType?.toLowerCase() == 'fixed' && (this.cartAmt < res?.data?.ammount)){
            this.promoCodeDetails = null;
            this.noPromoCode = true;
            this.discountAmt = 0;
            this.totalAmt = this.cartAmt + this.gst;
            this._toaster.showErrorToast("Invalid Promo Code");
          }
          else if (res && res.is_success) {
            this.noPromoCode = false;
            this.codeApplied = true;
            const todayDate = new Date(Date.now());
            const expDate = new Date(res?.data.dateofexp);
            const fromDate = new Date(res?.data.applicablefromdate);
            // response data----------

            this.promoCodeDetails = res?.data;
            this._toaster.showSuccessToast('Promo Code applied.');
            this.isCodeExpired = false;
            this.discountAmt =
              res?.data?.DiscountType?.toLowerCase() == 'fixed'
                ? res?.data?.ammount
                : this.cartAmt * (res?.data?.ammount / 100);
            this.totalAmt = this.cartAmt + this.gst - this.discountAmt;

            // if (todayDate >= fromDate && todayDate <= expDate) {
            //   this.promoCodeDetails = res?.data
            //   this._toaster.showSuccessToast("Promo Code applied.")
            //   this.isCodeExpired = false
            //   this.discountAmt = res?.data?.ammount
            //   this.totalAmt = this.cartAmt - res?.data?.ammount
            // } else {
            //   this._toaster.showErrorToast("Promo Code Expired.")
            //   this.isCodeExpired = true
            //   this.discountAmt = 0;
            //   this.totalAmt = this.cartAmt
            //   this.promoCodeDetails = null
            // }
          } else {
            this.promoCodeDetails = null;
            this.noPromoCode = true;
            this.discountAmt = 0;
            this.totalAmt = this.cartAmt + this.gst;
            this._toaster.showErrorToast(res?.message);
            // this._toaster.showErrorToast('No promo code found.')
          }
        });
    }
  }
  onPromoInput(event: any) {
    let value = event.target.value;
    value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    this.promoCode = value;
    event.target.value = value;
  }
}
