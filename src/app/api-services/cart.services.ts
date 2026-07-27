import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { apiEndPoint } from 'src/environments/environment';

import { HelperService } from './helper.services';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  isAddedInCart = new BehaviorSubject<boolean>(false);
  private _cartDetails: any;
  constructor(
    private _HttpClient: HttpClient,
    private _helper: HelperService
  ) { }

  getAllCartByUserId(id: number) {
    const url = `${apiEndPoint}/Get-all-by-UserId/${this._helper.getUserId}`;
    return this._HttpClient.get<any>(url, {
      headers: this._helper.apiHeader,
    });
  }
  addToCart(payload: any) {
    const url = `${apiEndPoint}/ADD-TO-Cart`;
    return this._HttpClient.post<any>(url, payload, {
      headers: this._helper.apiHeader,
    });
  }
  updateCart(payload: any) {
    const url = `${apiEndPoint}/Update-TO-Cart`;
    return this._HttpClient.post<any>(url, payload, {
      headers: this._helper.apiHeader,
    });
  }
  deleteCart(cartId: number, userId: number) {
    const url = `${apiEndPoint}/Delete-TO-Cart?CartId=${cartId}&UserId=${this._helper.getUserId}`;
    return this._HttpClient.delete<any>(url, {
      headers: this._helper.apiHeader,
    });
  }
  clearCart() {
    const url = `${apiEndPoint}/Delete-TO-All-Cart?UserId=${this._helper.getUserId}`;
    return this._HttpClient.delete<any>(url, {
      headers: this._helper.apiHeader,
    });
  }

  formatMoney(
    number: any,
    decPlaces: any = undefined,
    decSep: any = undefined,
    thouSep: any = undefined
  ) {
    (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
      (decSep = typeof decSep === 'undefined' ? '.' : decSep);
    thouSep = typeof thouSep === 'undefined' ? ',' : thouSep;
    var sign = number < 0 ? '-' : '';
    var i: any = String(
      parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces)))
    );
    var j: any = (j = i.length) > 3 ? j % 3 : 0;

    return (
      sign +
      (j ? i.substr(0, j) + thouSep : '') +
      i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, '$1' + thouSep) +
      (decPlaces
        ? decSep +
        Math.abs(number - i)
          .toFixed(decPlaces)
          .slice(2)
        : '')
    );
  }
  set CartDetails(val: any) {
    this._cartDetails = val;
  }
  get CartDetails() {
    return this._cartDetails;
  }
  postEnquiry(payload: any) {
    let url = `${apiEndPoint}/AddEnquiry`;
    if(!this._helper.getUserId) url = `${apiEndPoint}/AddEnquiryPreLogin`;
    return this._HttpClient.post<any>(url, payload, this._helper.getUserId ? {headers: this._helper.apiHeader} : {headers: {}});
  }
  needSupport(payload: any) {
    const url = `${apiEndPoint}/need-support`;
    return this._HttpClient.post<any>(url, payload);
  }
  checkPromoCode(obj: any) {
    const url = `${apiEndPoint}/Get-promotional-code-master?Coupancode=${obj?.code}&Amt=${obj?.Amt}`;
    return this._HttpClient.get<any>(url, {
      headers: this._helper.apiHeader,
    });
  }
}
