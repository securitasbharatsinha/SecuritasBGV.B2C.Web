import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/api-services/payment.services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  isAdded: boolean = false;
  constructor(
    private _route: ActivatedRoute,
    private _payment: PaymentService
  ) {}

  ngOnInit(): void {
    this._route.queryParams.subscribe((prm) => {
      if (prm && prm.cart) this.isAdded = prm.cart;
      else this.isAdded = false;
    });
  }
  buyNow() {
    this._payment.createOrder(90, 3);
  }
}
