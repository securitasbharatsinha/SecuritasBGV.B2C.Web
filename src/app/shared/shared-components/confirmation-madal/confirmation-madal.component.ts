import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile } from 'rxjs/operators';
import { CartService } from 'src/app/api-services/cart.services';
import { HelperService } from 'src/app/api-services/helper.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { ToasterService } from 'src/app/api-services/toaster.services';

@Component({
  selector: 'app-confirmation-madal',
  templateUrl: './confirmation-madal.component.html',
  styleUrls: ['./confirmation-madal.component.scss'],
})
export class ConfirmationMadalComponent implements OnInit, OnDestroy {
  @Output() isItemIncard = new EventEmitter<boolean>(false);

  isLive: boolean = true;
  AllCartItems: any[] = [];
  updatedCartItems: any[] = [];
  totalAmt: number = 0;
  isLoggedIn: boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _helper: HelperService,
    private _payment: PaymentService,
    private _cart: CartService,
    private _NgbActiveModal: NgbActiveModal,
    private _toaster: ToasterService
  ) {}
  ngOnDestroy(): void {
    this.isLive = false;
  }

  ngOnInit(): void {
    this._helper.getCartItemsFromLocastorage!.subscribe((res: any) => {
      if (isPlatformBrowser(this.platformId) && res && res.length) {
        this.handleLocalstorageData(res);
      } else {
        this.AllCartItems = [];
        this.totalAmt = 0;
        this.isItemIncard.emit(false);
      }
    });
    this._cart.isAddedInCart
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res: boolean) => {
        if (res) {
          this._NgbActiveModal.close({
            data: 'Modal Closed',
          });
          localStorage.removeItem('isReadyToBuy');
          localStorage.removeItem('cartItems');
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
  addTocartAndPay() {
    const payload = {
      ServiceId: this.AllCartItems[0].service_id,
      PackageId: this.AllCartItems[0].package_id,
      // ServiceId: this.AllCartItems.map((d: any) => d.service_id).join(','),
      // PackageId: this.AllCartItems.map((d: any) => d.package_id).join(','),
      PackageServiceId: this.AllCartItems.map((d: any) => {
        let ids: number[] = [];
        d.packageServices.map((el: any) => {
          ids.push(el.package_service_id);
        });
        return ids;
      }).join(','),
      UserId: this._helper.getUserId,
    };
    this._cart
      .addToCart(payload)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res && res.IsSuccess) {
          this.getAllCartByUserId();
        } else {
        }
      });
  }
  getAllCartByUserId() {
    this._cart
      .getAllCartByUserId(1)
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        if (res && res.IsSuccess) {
          this.buyNow(res.Data[0]);
        } else {
        }
      });
  }
  buyNow(res: any) {
    if (this._helper.isLoggedIn) {
      if (this._helper.getUserType == 2) {
        this._payment.createOrder(
          this.totalAmt,
          res.PackageId,
          res.ServiceId,
          res.PackageServiceId.split(','),
          [res.CartId]
        );
        // this._toaster.successAlert('Services purchased.', 0).then((result) => {
        //   if (result.isConfirmed) {
        //   }
        // });
      } else
        this._payment.createOrder(
          this.totalAmt,
          res.PackageId,
          res.ServiceId,
          res.PackageServiceId.split(','),
          [res.CartId]
        );
    }
  }
  closeModal() {
    this._NgbActiveModal.close({
      data: 'Modal Closed',
    });
  }
}
