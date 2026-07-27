import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { knowHow, knowWhy } from 'src/app/api-interfaces/securitas-services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';

@Component({
  selector: 'app-digital-verification',
  templateUrl: './digital-verification.component.html',
  styleUrls: ['./digital-verification.component.scss'],
})
export class DigitalVerificationComponent implements OnInit, OnDestroy {
  knowWhy: knowWhy;
  knowHow: knowHow;
  // serviceTypeId: number;
  @Input() serviceTypeId: number;
  islive: boolean = true;
  isAddedCart: any;
  servicesPackagesdata: any;
  selectedPackageServiceIds: number[] = [];
  totalAmount = 0;
  constructor(
    private route: ActivatedRoute,
    private _securitasService: SecuritasServiceService,
    private _payment: PaymentService,
    private _router: Router,
    private _home: HomePageService
  ) {}
  ngOnDestroy(): void {
    this.islive = false;
  }

  ngOnInit(): void {
    // this.route.queryParams.subscribe((prm) => {
    //   this.serviceTypeId = prm.service;
    //   this.loadData();
    // });
    this.loadData();
  }
  loadData() {
    if (this.serviceTypeId) {
      // this._securitasService
      //   .getKnowWhyListById(this.serviceTypeId)
      //   .pipe(takeWhile(() => this.islive))
      //   .subscribe(
      //     (res: any) => {
      //       if (res) this.knowWhy = res.data;
      //     },
      //     (err: any) => {
      //     }
      //   );
      // this._securitasService
      //   .getKnowHowListById(this.serviceTypeId)
      //   .pipe(takeWhile(() => this.islive))
      //   .subscribe(
      //     (res: any) => {
      //       if (res) this.knowHow = res.data;
      //     },
      //     (err: any) => {
      //     }
      //   );
      this._home
        .getServiceById(this.serviceTypeId)
        .pipe(takeWhile(() => this.islive))
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess) {
              //@ts-ignore
              this.servicesPackagesdata = res.Data.map((el: any) => {
                let pack = el.packageServices.map((d: any) => {
                  return {
                    ...d,

                    oldPrice: d.service_price,
                  };
                });
                return {
                  ...el,
                  packageServices: pack,
                  isSelected: false,
                };
                // return {
                //   ...el,
                //   isSelected: false,
                // };
              });
            }
            // this.servicesPackagesdata = res.Data.find(
            //   (d: any) => d.package_name === 'À la carte'
            // );
          },
          (err: any) => {
          }
        );
    }
  }
  // buyNow() {
  //   this._payment.createOrder(500, 1, 1, [1, 2]);
  // }
  buyNow() {

    this._payment.createOrder(
      this.totalAmount,
      this.servicesPackagesdata.package_id,
      this.serviceTypeId,
      this.selectedPackageServiceIds
    );
  }
  goToCart() {
    if (this.isAddedCart) {
      this._router.navigate(['/cart'], { queryParams: { cart: true } });
    }
  }
  selectService($event: any) {
    const id: number = $event.target.value;

    //@ts-ignore
    const singleService = this.servicesPackagesdata.packageServices.find(
      (d: any) => {
        return d.package_service_id == id;
      }
    );

    if ($event.target.checked) {
      this.selectedPackageServiceIds.push(id);
      //@ts-ignore
      this.totalAmount += singleService?.service_price;
    } else {
      this.selectedPackageServiceIds.splice(
        this.selectedPackageServiceIds.indexOf(id),
        1
      );
      //@ts-ignore
      this.totalAmount -= singleService?.service_price;
    }
  }
}
