import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile, tap } from 'rxjs/operators';
import { getPortalPath } from 'src/environments/environment';
import { apiEndPoint } from 'src/environments/environment';
import { AuthService } from './auth.services';
import { CartService } from './cart.services';
import { HelperService } from './helper.services';
import { ToasterService } from './toaster.services';
import { HomePageService } from './home-page.services';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

function getWindow(): any {
  return window;
}
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  // reloadWallet = new BehaviorSubject<any>(null);
  _WalletDetails = new BehaviorSubject<any>(null);
  payWithoutWallet = new BehaviorSubject<any>(null);
  payWithoutWalletInstant = new BehaviorSubject<any>(null);
  orderInProgress = false;
  isLive: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _HttpClient: HttpClient,
    private _helper: HelperService,
    private _router: Router,
    private _auth: AuthService,
    private _cart: CartService,
    private _toaster: ToasterService,
    private _home: HomePageService
  ) { }

  get nativeWindow(): any {
    return getWindow();
  }
  walletPayment(obj: any, orderId: string) {
    const url = `${apiEndPoint}/Response-Add-Wallet?PaymentId=${obj.razorpay_payment_id}&OrderId=${orderId}`;

    return this._HttpClient
      .post(url, '', {
        headers: this._helper.apiHeader,
      })
      .subscribe((res: any) => {
        if (res && res.is_success) {
          // this.reloadWallet.next({ reload: true });
          this.payWithoutWallet.next({ pay: true });
          // this._toaster.showSuccessToast('Wallet updated.');
        }
      });
  }
  walletPaymentInstant(obj: any, orderId: string) {
    const url = `${apiEndPoint}/Response-Add-Wallet?PaymentId=${obj.razorpay_payment_id}&OrderId=${orderId}`;

    return this._HttpClient
      .post(url, '', {
        headers: this._helper.apiHeader,
      })
      .subscribe((res: any) => {
        if (res && res.is_success) {
          // this.reloadWallet.next({ reload: true });
          this.payWithoutWalletInstant.next({ pay: true });
          // this._toaster.showSuccessToast('Wallet updated.');
        }
      });
  }
  createOrderForCandidate(payload: any) {
    const url = `${apiEndPoint}/Create-Direct-order-for-others-from-wallet`;

    return this._HttpClient
      .post(url, payload, {
        headers: this._helper.apiHeader,
      })
      // .pipe(
      //   tap((res: any) => {
      //     if (res && res.is_success) {
      //       this._toaster.showSuccessToast("Checks purchased successfully !!");
      //     } else {
      //     }
      //   })
      // );
      .pipe(
        tap((res: any) => {
          if (res && res.is_success) {
            this._toaster.showSuccessToast('Checks purchased successfully !!');
            // redirect ab shared-cart.component.ts me hai (order-wise)
          }
        })
      );
  }
  updateOrderStatus(payload: any) {
    const url = `${apiEndPoint}/Update-Order-status`;
    return this._HttpClient
      .post(url, payload,{
        headers: this._helper.apiHeader,
      }
    );
  }

  saveAllChecks(payload: any) {
    const apiUrl = `${apiEndPoint}/create-verification`;
    const requests = payload.map((payload: any) => this._HttpClient.post(apiUrl, payload,{
      headers: this._helper.apiHeader,
    }));
    return forkJoin(requests);
  }

  savePersonalPage(payload: any) {
    const url = `${apiEndPoint}/Post-Personal-Detail`;
    return this._HttpClient
      .post(url, payload,{
        headers: this._helper.apiHeader,
      }
    );
  }
  addWallet(payload: any) {
    const url = `${apiEndPoint}/Request-Add-Wallet`;

    return this._HttpClient.post(url, payload, {
      headers: this._helper.apiHeader,
    });
  }
  SavePromoCode(payload: any) {
    const url = `${apiEndPoint}/Save-promotional-code-details`;

    return this._HttpClient.post(url, payload, {
      headers: this._helper.apiHeader,
    }).subscribe((res: any) => { res?.is_success });
  }
  getWallet() {
    const url = `${apiEndPoint}/Get-Wallet-History`;

    return this._HttpClient
      .get(url, {
        headers: this._helper.apiHeader,
      })
      .pipe(
        tap((res) => {
          this._WalletDetails.next(res);
        })
      );
  }

  payViaWallet(payload: any) {
    const url = `${apiEndPoint}/PurchaseCartOrder`;

    return this._HttpClient
      .post(url, payload, {
        headers: this._helper.apiHeader,
      })
      // .pipe(
      //   tap((res: any) => {
      //     if (res && res.is_success) {
      //       // this.reloadWallet.next({ reload: true });
      //       this._toaster.showSuccessToast('Checks purchased successfully !!');
      //       window.location.href = getPortalPath('');
      //     }
      //   })
      // );
      .pipe(
        tap((res: any) => {
          if (res && res.is_success) {
            this._toaster.showSuccessToast('Checks purchased successfully !!');
            // redirect shared-cart.component.ts me hai (order-wise, key ke saath)
          }
        })
      );
  }
  createOrderForPayment(payload: any) {
    const url = `${apiEndPoint}/create-order`;

    return this._HttpClient.post(url, payload, {
      headers: this._helper.apiHeader,
    });
  }
  doPayment(payload: any) {
    const url = `${apiEndPoint}/payment-response`;

    return this._HttpClient.post(url, payload, {
      headers: this._helper.apiHeader,
    });
  }

  createOrder(
    amt: number = 400,
    pkgId: number = 1,
    serviceId: number = 2,
    packageServicesIds: any[] = [1, 2],
    CartId?: number[]
  ) {
    if (this._helper.isLoggedIn) {
      const user = this._helper.user;
      this.isLive = true;
      if (amt && pkgId) {
        const order = {
          tokenId: '100001010101ffff',
          userId: Number(user.Id),
          username: user.FName + ' ' + user.LName,
          email: user.Email,
          contact: user.Phone,
          address: user.Address1 || '-',
          amount: Math.round(amt * 100),
          CartId: CartId ? CartId.join(',') : '',
          PackageId: pkgId.toString(),

          ServiceId: serviceId.toString(),
          PackageServiceId: packageServicesIds.join(','),
        };

        this.createOrderForPayment(order)
          .pipe(takeWhile(() => this.isLive))
          .subscribe(
            (res: any) => {

              if (res && res.is_success) {
                this.payNow(res.data);
              } else {
                this.isLive = false;
                this._toaster.showErrorToast(res.ex_message);
              }
            },
            (err) => {
              this.isLive = false;
            }
          );
      }
    } else {
      if (
        confirm(`
      You are not logged in.
      Please log In and continue !!
      `) === true
      ) {
        this._router.navigate(['/auth']);
      } else {
      }
    }
  }
  payNow(orderObj: any) {
    if (this._helper.isLoggedIn) {
      var globalThis = this;
      const options = {
        key: orderObj.razorpayKey.trim(),
        amount: orderObj.amount,
        currency: orderObj.currency,
        name: orderObj.name,
        description: orderObj.description,
        // image: 'https://securitasb2cweb.keycorp.in/assets/img/logo_b.png',
        image: 'https://walsonsverify.com/assets/img/logo_b.png',
        order_id: orderObj.orderId,
        handler: function (response: any) {
          if (response) {
            globalThis.packagePayment(response);
            // globalThis._toaster.showInfoToast(response.razorpay_payment_id);

            // this.doPayment(response)
          }
        },
        prefill: {
          name: orderObj.name,
          email: orderObj.email,
          contact: orderObj.contact,
        },
        notes: {
          address: orderObj.address,
        },
        theme: {
          // color: '#3399cc',
          color: '#031F30',
        },
      };
      var rzp1 = new this._auth.nativeWindow.Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function (response: any) {
      });
    } else {
      if (
        confirm(`
      You are not logged in.
      Please log In and continue !!
      `) === true
      ) {
        this._router.navigate(['/auth']);
      } else {
      }
    }
  }
  packagePayment(res: any) {
    if (res) {
      const payment = {
        payment_id: res.razorpay_payment_id,
        order_id: res.razorpay_order_id,
        razar_signature: res.razorpay_signature,
        userId: Number(this._helper.getUserId),
      };
      this.doPayment(payment)
        .pipe(takeWhile(() => this.isLive))
        .subscribe(
          (res: any) => {
            this.isLive = false;
            if (res && res.is_success) {
              this._toaster.showSuccessToast('Payment Successfull !!');
              // this.SubmitForm(payment);
              this._cart.isAddedInCart.next(true);
              window.location.href = getPortalPath(payment.order_id);
            } else {
              this._toaster.showErrorToast(res.ex_message);
            }
          },
          (err) => {
          }
        );
    }
  }
  createPostpaidOrder(payload: any) {
    const url = `${apiEndPoint}/Pospaid-Customer-Payment`;

    return this._HttpClient.post(url, payload, {
      headers: this._helper.apiHeader,
    });
  }
  SubmitForm(payment: any) {
    let pkgId = '';
    let ind = 0;
    const cardIds = this._cart.CartDetails.map((el: any) => {
      return {
        cartId: el.CartId,
        PackageServiceId: el.PackageServiceId,
      };
    }).map((d: any) => {
      if (pkgId == d.PackageServiceId) {
        ++ind;
        return {
          ...d,
          indx: ind,
        };
      } else {
        pkgId = d.PackageServiceId;
        ind = 1;
        return {
          ...d,
          indx: ind,
        };
      }
    });
    cardIds.forEach((d: any, i: number) => {
      if (isPlatformBrowser(this.platformId)) {
        let key = `${d.PackageServiceId}+${d.indx}`;
        let checkValue = window.localStorage.getItem(key);
        if (checkValue) {
          const val = JSON.parse(checkValue);
          this.submitCheck(payment, d.cartId, val, key);
          window.localStorage.removeItem(key);
        }
      }
    });
  }
  submitCheck(payment: any, cartId: string | number, val: any, key: string) {
    const details = {
      CandidateId: 0,
      UserId: Number(this._helper.getUserId),
      OrderId: payment.order_id,
      ColumnsName: val?.checkInfo.service_name.replaceAll(/([^\w]+|\s+)/g, ''),
      ColumnsNameValue: JSON.stringify(val?.value),
      SubmittedBy: 'User',
      CheckId: val?.checkInfo.Package_service_Code,
      SeqNo: 1,
      PackageServiceId: Number(val?.checkInfo.package_service_id),
      CartId: Number(cartId),
      CreatedBy: Number(this._helper.getUserId),
    };

    this._home
      .submitcheckForm(details)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res: any) => {
        if (res && res.is_success) {
          if (isPlatformBrowser(this.platformId)) {
          }
        } else {
        }
      });
  }
  payWalletNow(orderObj: any, promoCodeData: any) {
    if (this._helper.isLoggedIn) {
      var globalThis = this;
      const options = {
        key: orderObj.razorpayKey.trim(),
        amount: orderObj.RequestAmt,
        currency: orderObj.Currency,
        name: orderObj.Name,
        description: orderObj.description,
        // image: 'https://securitasb2cweb.keycorp.in/assets/img/logo_b.png',
                image: 'https://walsonsverify.com/assets/img/logo_b.png',
        
        order_id: orderObj.OrderId,
        handler: function (response: any) {
          if (response) {
            globalThis.SavePromoCode(promoCodeData);
            globalThis.walletPayment(response, orderObj.OrderId);
          }
        },
        prefill: {
          name: orderObj.name,
          email: orderObj.email,
          contact: orderObj.contact,
        },
        notes: {
          address: orderObj.address,
        },
        theme: {
          // color: '#3399cc',
          color: '#031F30',
        },
      };
      var rzp1 = new this._auth.nativeWindow.Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function (response: any) {
      });
    } else {
      if (
        confirm(`
      You are not logged in.
      Please log In and continue !!
      `) === true
      ) {
        this._router.navigate(['/auth']);
      } else {
      }
    }
  }
}
