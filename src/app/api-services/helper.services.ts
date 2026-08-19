import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ToasterService } from './toaster.services';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { getPortalPath } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  private _userDetails: any;
  isLoggedOut = new BehaviorSubject<boolean>(false);
  uDetails = new BehaviorSubject<any>(null);
  private cartItemsFromStorage = new BehaviorSubject<any[]>([]);
  constructor(
    private _http: HttpClient,
    private _cookie: CookieService,
    private _toaster: ToasterService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

//   get getAuthObj() {
//     if (
//       isPlatformBrowser(this.platformId) &&
//       document.cookie
//         .split(';')
//         .some((item) => item.trim().startsWith('sessionauth='))
//     ) {
//       let cookie: any = {};

//       // document.cookie.split(';').forEach(function (el) {
//       //   let [key, value] = el.split('=');
//       //   cookie[key.trim()] = value;
//       // });
//       document.cookie.split(';').forEach(function (el) {
//   const idx = el.indexOf('=');
//   if (idx < 0) return;
//   cookie[el.slice(0, idx).trim()] = el.slice(idx + 1);
// });
//       return cookie['sessionauth'];
//     }
//     return null;
//   }


get getAuthObj(): string {
    if (
      isPlatformBrowser(this.platformId) &&
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('sessionauth='))
    ) {
      let cookie: any = {};

      document.cookie.split(';').forEach(function (el) {
        const idx = el.indexOf('=');
        if (idx < 0) return;
        cookie[el.slice(0, idx).trim()] = el.slice(idx + 1);
      });

      const raw = cookie['sessionauth'];
      return raw ? decodeURIComponent(raw) : 'null';
    }
    return 'null';
  }
  get header() {
    const header = new HttpHeaders().set(
      'Authorization',
      `Token ${this.getAuthObj}`
    );
    return header;
  }
  get apiHeader() {
    const header = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Basic U2VjdXJpdHVzOlNlY3VyaXR1c0AyMDIz')
      .append('Token', this.getUserToken);
    return header;
  }
  get isLoggedIn() {
    // return this._cookie.get('isLoggedIn') === 'true';

    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname === 'localhost'
    )
      return this._cookie.get('isLoggedIn') === 'true';
    else {
      const auth = JSON.parse(this.getAuthObj);

      if (auth) return auth.isLoggedIn && auth.token ? true : false;
      else return false;
    }
  }
  get getUserToken() {
    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname === 'localhost'
    )
      return this.isLoggedIn ? this._cookie.get('token') : null;
    else {
      const auth = JSON.parse(this.getAuthObj);
      if (auth) return auth.isLoggedIn && auth.token ? auth.token : null;
      else return null;
    }
  }
  get getUserType() {
    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname === 'localhost'
    )
      return this.isLoggedIn ? this._cookie.get('userType') : null;
    else {
      const auth = JSON.parse(this.getAuthObj);
      if (auth) return auth.isLoggedIn && auth.userType ? auth.userType : null;
      else return null;
    }
  }
  get getUserCategory() {
    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname === 'localhost'
    )
      return this.isLoggedIn ? this._cookie.get('userCatgeory') : null;
    else {
      const auth = JSON.parse(this.getAuthObj);
      if (auth)
        return auth.isLoggedIn && auth.userCatgeory ? auth.userCatgeory : null;
      else return null;
    }
  }

  get getUserId() {
    // return this.isLoggedIn ? 5 : null;
    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname === 'localhost'
    )
      return this._cookie.get('userId');
    else {
      const auth = JSON.parse(this.getAuthObj);

      if (auth) return auth.userId;
      else return null;
    }
  }
  get getClientId() {
    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname === 'localhost'
    )
      return this._cookie.get('clientId');
    else {
      const auth = JSON.parse(this.getAuthObj);

      if (auth) return auth.clientId;
      else return null;
    }
  }
  get getIndustryType() {
    if (
      isPlatformBrowser(this.platformId) &&
      window.location.hostname === 'localhost'
    )
      return this._cookie.get('industryType');
    else {
      const auth = JSON.parse(this.getAuthObj);

      if (auth) return auth.industryType;
      else return null;
    }
  }

  localStorageHandler(item: any) {
    if (isPlatformBrowser(this.platformId)) {
      var existingItems = localStorage.getItem('cartItems');
      if (existingItems) {
        let newItems = JSON.parse(existingItems);
        newItems.push(item);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        this._toaster.showSuccessToast('Cart added successfully.');
        let data = this.getCartItemsFromLocastorage;
        let items = JSON.parse(
          JSON.stringify(localStorage.getItem('cartItems'))
        );
        this.cartItemsFromStorage.next(items);
      } else {
        localStorage.setItem('cartItems', JSON.stringify([{ ...item }]));
        this._toaster.showSuccessToast('Cart added successfully.');
        let data = this.getCartItemsFromLocastorage;
        let items = JSON.parse(
          JSON.stringify(localStorage.getItem('cartItems'))
        );
        this.cartItemsFromStorage.next(items);
      }
    }
  }
  get getCartItemsFromLocastorage() {
    if (isPlatformBrowser(this.platformId)) {
      let items = JSON.parse(JSON.stringify(localStorage.getItem('cartItems')));

      if (items) this.cartItemsFromStorage.next(items);
    }

    return this.cartItemsFromStorage as Observable<any[]>;
  }
  deleteItemFromStorage(indx: number) {
    if (isPlatformBrowser(this.platformId)) {
      let items = localStorage.getItem('cartItems');
      if (items) {
        let newItems = JSON.parse(items);
        newItems.splice(indx, 1);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        this._toaster.showSuccessToast('Cart removed successfully.');
        let data = this.getCartItemsFromLocastorage;
        let items1 = JSON.parse(
          JSON.stringify(localStorage.getItem('cartItems'))
        );
        this.cartItemsFromStorage.next(items1);
      }
    }
  }
  set user(value: any) {
    this._userDetails = value;
  }
  get user() {
    return this._userDetails;
  }
  askForSignup(roleId: number, title: string) {
    Swal.fire({
      title: title,
      icon: 'info',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      confirmButtonText: roleId === 1 ? 'Ok' : 'Login',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        roleId === 1 && (window.location.href = getPortalPath(''));
        roleId === 4 && this._router.navigate(['/auth/login']);
        roleId === 2 && this._router.navigate(['/auth/login']);
      }
    });
  }
}
