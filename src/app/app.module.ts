import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgwWowModule } from 'ngx-wow';

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InteceptorService } from './core/interceptors/interceptor.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './core/gaurd/auth.gaurd';
import { LoginGuard } from './core/gaurd/login.gaurd';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    // CarouselModule,
    NgwWowModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // FontAwesomeModule,
    // SlickCarouselModule,
  ],
  providers: [
    CookieService,
    AuthGuard,
    LoginGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InteceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
