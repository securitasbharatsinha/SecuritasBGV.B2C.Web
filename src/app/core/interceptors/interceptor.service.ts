import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { COOKIE_DOMAIN } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InteceptorService implements HttpInterceptor {
  isSpecialWindow: boolean;
  constructor(
    private _router: Router,
    private _cookie: CookieService,
    private _toaster: ToasterService
  ) {
    this.isSpecialWindow = this._router.url.includes('special')

  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (res) => { },
        (err: HttpErrorResponse) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._toaster.showErrorToast('Session Expired !!');
              document.cookie = `sessionauth=; domain=${COOKIE_DOMAIN}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              this._cookie.deleteAll();
              this._router.navigate([this.isSpecialWindow ? '/special/login' : '/auth/login']);
            }
          }
        }
      )
    );
  }
}
