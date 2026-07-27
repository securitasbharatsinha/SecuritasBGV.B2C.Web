import { Injectable } from '@angular/core';
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/api-services/helper.services';

@Injectable()
export class AuthGuard implements CanActivate {
  isSpecialWindow: boolean;
  constructor(private router: Router, private _helper: HelperService) {
    this.isSpecialWindow = this.router.url.includes('special')
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._helper.isLoggedIn) {

      return true;
    }
    this.router.navigate([this.isSpecialWindow ? '/special/login' : '/auth/login']);
    return false;
  }
}
