import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { knowHow, knowWhy } from 'src/app/api-interfaces/securitas-services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';

@Component({
  selector: 'app-helper-verification',
  templateUrl: './helper-verification.component.html',
  styleUrls: ['./helper-verification.component.scss'],
})
export class HelperVerificationComponent implements OnInit, OnDestroy {
  knowWhy: knowWhy;
  knowHow: knowHow;
  // serviceTypeId: number;
  @Input() serviceTypeId: number;
  islive: boolean = true;
  isAddedCart: any;
  servicesPackagesdata: any[] = [];
  selectedPackageServiceIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private _securitasService: SecuritasServiceService,
    private _payment: PaymentService,
    private _router: Router,
    private _home: HomePageService
  ) {}

  ngOnInit(): void {
    this.loadData();

    // this.route.queryParams.subscribe((prm) => {
    //   this.serviceTypeId = prm.service;
    //   this.loadData();
    // });
  }
  ngOnDestroy(): void {
    this.islive = false;
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
                    isSelected: false,
                  };
                });
                return {
                  ...el,
                  packageServices: pack,
                  isSelected: false,
                };
              });
            }


            // this.setPackage();
          },
          (err: any) => {
          }
        );
    }
  }
  buyNow() {
    this._payment.createOrder(500, 1, 1, [1, 2]);
  }
  goToCart() {
    if (this.isAddedCart) {
      this._router.navigate(['/cart'], { queryParams: { cart: true } });
    }
  }
  selectService($event: any) {
    const id: number = $event.target.value;
    if ($event.target.checked) {
      this.selectedPackageServiceIds.push(id);
    } else {
      this.selectedPackageServiceIds.splice(
        this.selectedPackageServiceIds.indexOf(id),
        1
      );
    }
  }
  selectPackage(event: any, i: number) {
    if (event.target.checked) {
      this.servicesPackagesdata[i].isSelected = true;
      this.servicesPackagesdata[i].packageServices.forEach(
        (el: any) => (el.isSelected = true)
      );
    } else {
      this.servicesPackagesdata[i].isSelected = false;
      this.servicesPackagesdata[i].packageServices.forEach(
        (el: any) => (el.isSelected = false)
      );
    }
  }
  setPackage() {
    this.servicesPackagesdata = this.servicesPackagesdata.map((el) => {
      let pack = el.packageServices.map((d: any) => {
        return {
          ...d,
          isSelected: false,
        };
      });
      return {
        ...el,
        packageServices: pack,
        isSelected: false,
      };
    });
  }
}
