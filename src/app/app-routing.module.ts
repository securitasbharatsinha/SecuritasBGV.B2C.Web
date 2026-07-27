import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './core/gaurd/login.gaurd';
import { AuthGuard } from './core/gaurd/auth.gaurd';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./base/base.module').then((m) => m.BaseModule),
  },

  {
    path: 'auth',

    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'special',
    canActivate: [LoginGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  // { path: 'individual', loadChildren: () => import('./special-ind/special-ind.module').then(m => m.SpecialIndModule) },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      initialNavigation: 'enabled',
      anchorScrolling: 'enabled'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor() {
  }
}
