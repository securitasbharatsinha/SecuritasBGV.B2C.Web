import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { knowHow, knowWhy } from 'src/app/api-interfaces/securitas-services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';

@Component({
  selector: 'app-leadership-due-diligence',
  templateUrl: './leadership-due-diligence.component.html',
  styleUrls: ['./leadership-due-diligence.component.scss'],
})
export class LeadershipDueDiligenceComponent implements OnInit, OnDestroy {
  @Input() serviceId: number;
  knowWhy: knowWhy;
  knowHow: knowHow;
  // serviceTypeId: number;
  @Input() serviceTypeId: number;
  islive: boolean = true;
  isAddedCart: any;
  constructor(
    private route: ActivatedRoute,
    private _securitasService: SecuritasServiceService,
    private _payment: PaymentService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe((prm) => {
    //   this.serviceTypeId = prm.service;
    //   this.loadData();
    // });
    this.loadData();
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
}
