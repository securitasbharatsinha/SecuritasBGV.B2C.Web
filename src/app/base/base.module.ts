import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { LayoutModule } from '../layout/layout.module';
import { AuthGuard } from '../core/gaurd/auth.gaurd';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
      },

      {
        path: 'author',
        loadChildren: () =>
          import('../author/author.module').then((m) => m.AuthorModule),
      },
      {
        path: 'book',
        loadChildren: () =>
          import('../book/book.module').then((m) => m.BookModule),
      },
      {
        path: 'faq',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../components/faq/faq.module').then((m) => m.FaqModule),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('../components/about/about.module').then((m) => m.AboutModule),
      },
      {
        path: 'services',
        loadChildren: () =>
          import(
            '../components/securitas-services/securitas-services.module'
          ).then((m) => m.SecuritasServicesModule),
      },
      {
        path: 'individual',
        loadChildren: () =>
          import('../components/individual/individual.module').then(
            (m) => m.IndividualModule
          ),
      },
      {
        path: 'corporate',
        loadChildren: () =>
          import('../components/corporate/corporate.module').then(
            (m) => m.CorporateModule
          ),
      },
      {
        path: 'verify-yourself',
        loadChildren: () =>
          import('../components/individual2/individual2.module').then(
            (m) => m.Individual2Module
          ),
      },
      {
        path: 'helper-verification',
        loadChildren: () =>
          import('../components/individual2/individual2.module').then(
            (m) => m.Individual2Module
          ),
      },
      {
        path: 'tenant-verification',
        loadChildren: () =>
          import('../components/individual2/individual2.module').then(
            (m) => m.Individual2Module
          ),
      },
      {
        path: 'matrimonial-due-diligence',
        loadChildren: () =>
          import('../components/individual2/individual2.module').then(
            (m) => m.Individual2Module
          ),
      },
      {
        path: 'instant-verify',
        loadChildren: () =>
          import('../components/individual2/individual2.module').then(
            (m) => m.Individual2Module
          ),
      },

      // {
      //   path: 'blog',
      //   loadChildren: () =>
      //     import('./blog/blog.module').then((m) => m.BlogModule),
      // },
      {
        path: 'check-for-industry',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../components/check-for-industry/check-for-industry.module'
          ).then((m) => m.CheckForIndustryModule),
      },
      // {
      //   path: 'wallet',
      //   canActivate: [AuthGuard],
      //   loadChildren: () =>
      //     import('../components/wallet/wallet.module').then(
      //       (m) => m.WalletModule
      //     ),
      // },

      {
        path: 'supplier-connect',
        loadChildren: () =>
          import('../components/partner-with-us/partner-with-us.module').then(
            (m) => m.PartnerWithUsModule
          ),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('../components/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'help-center',
        loadChildren: () =>
          import('../components/help-center/help-center.module').then(
            (m) => m.HelpCenterModule
          ),
      },
      {
        path: 'sitemap',
        loadChildren: () =>
          import('../components/sitemap/sitemap.module').then(
            (m) => m.SitemapModule
          ),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('../components/privacy-policy/privacy-policy.module').then(
            (m) => m.PrivacyPolicyModule
          ),
      },
      {
        path: 'cookies-policy',
        loadChildren: () =>
          import('../components/cookie-policy/cookie-policy.module').then(
            (m) => m.CookiePolicyModule
          ),
      },

      // {
      //   path: '**',
      //   redirectTo: 'home',
      // },
    ],
  },
  {
    path: 'special',
    component: BaseComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'home',
      // },
      // {
      //   path: 'home',
      //   loadChildren: () =>
      //     import('../home/home.module').then((m) => m.HomeModule),
      // },

      // {
      //   path: 'author',
      //   loadChildren: () =>
      //     import('../author/author.module').then((m) => m.AuthorModule),
      // },
      // {
      //   path: 'book',
      //   loadChildren: () =>
      //     import('../book/book.module').then((m) => m.BookModule),
      // },
      {
        path: 'faq',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../components/faq/faq.module').then((m) => m.FaqModule),
      },
      // {
      //   path: 'about',
      //   loadChildren: () =>
      //     import('../components/about/about.module').then((m) => m.AboutModule),
      // },
      {
        path: 'services',
        loadChildren: () =>
          import(
            '../components/securitas-services/securitas-services.module'
          ).then((m) => m.SecuritasServicesModule),
      },
      {
        path: 'individual',
        loadChildren: () =>
          import('../components/individual/individual.module').then(
            (m) => m.IndividualModule
          ),
      },
      // {
      //   path: 'corporate',
      //   loadChildren: () =>
      //     import('../components/corporate/corporate.module').then(
      //       (m) => m.CorporateModule
      //     ),
      // },
      // {
      //   path: 'blog',
      //   loadChildren: () =>
      //     import('./blog/blog.module').then((m) => m.BlogModule),
      // },
      {
        path: 'check-for-industry',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import(
            '../components/check-for-industry/check-for-industry.module'
          ).then((m) => m.CheckForIndustryModule),
      },
      // {
      //   path: 'wallet',
      //   canActivate: [AuthGuard],
      //   loadChildren: () =>
      //     import('../components/wallet/wallet.module').then(
      //       (m) => m.WalletModule
      //     ),
      // },

      // {
      //   path: 'supplier-connect',
      //   loadChildren: () =>
      //     import('../components/partner-with-us/partner-with-us.module').then(
      //       (m) => m.PartnerWithUsModule
      //     ),
      // },
      {
        path: 'cart',
        loadChildren: () =>
          import('../components/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'help-center',
        loadChildren: () =>
          import('../components/help-center/help-center.module').then(
            (m) => m.HelpCenterModule
          ),
      },
      {
        path: 'sitemap',
        loadChildren: () =>
          import('../components/sitemap/sitemap.module').then(
            (m) => m.SitemapModule
          ),
      },

      // {
      //   path: '**',
      //   redirectTo: 'home',
      // },
    ],
  },
];

@NgModule({
  declarations: [BaseComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LayoutModule],
  exports: [RouterModule],
})
export class BaseModule {
  constructor() {
  }
}
