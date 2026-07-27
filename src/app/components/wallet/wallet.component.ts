import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { take, takeWhile } from 'rxjs/operators';
import { HelperService } from 'src/app/api-services/helper.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  RequestAmt: number;
  history: any[] = [];
  isLive = true;
  walletBalance: any;
  constructor(
    private _payment: PaymentService,
    private _helper: HelperService
  ) {}
  ngOnDestroy(): void {
    this.isLive = false;
  }

  ngOnInit(): void {
    this._payment._WalletDetails
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res && res.is_success) {
          this.walletBalance = res.data[0]?.AvailableBalance ?? 0;
          this.history = res.data[0]?.WalletViews.reverse().filter(
            (el: any) => el.PaymentStatus !== 'Initiated'
          );
        }
      });
  }

  addWallet() {
    const user = this._helper.user;
    const req = {
      Name: user.FName + ' ' + user.LName,
      Email: user.Email,
      Contact: user.Phone,
      Address: user.Address1 || '-',
      RequestAmt: this.RequestAmt * 100,
      description: 'Add to wallet',
    };
    if (this.RequestAmt) {
      this._payment
        .addWallet(req)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res && res.is_success) {
            this.RequestAmt = 0.0;
            this._payment.payWalletNow(res.data);
          }
        });
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
        this.addWallet();
      }
    });
  }
}
