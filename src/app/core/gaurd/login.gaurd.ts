import { Injectable } from '@angular/core';
import {
    CanActivate,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    NavigationEnd,
} from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HelperService } from 'src/app/api-services/helper.services';

@Injectable()
export class LoginGuard implements CanActivate {
    isSpecialWindow: boolean;
    constructor(private router: Router, private _helper: HelperService) {
        this.isSpecialWindow = this.router.url.includes('special')

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._helper.isLoggedIn) {
            this.router.navigate([Number(this._helper.getClientId) ? '/special/individual' : '/home'])

            return false;
        } else
            return true

    }
}
