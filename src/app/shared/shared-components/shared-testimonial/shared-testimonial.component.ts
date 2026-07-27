import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { takeWhile } from 'rxjs/operators';
import {
  singlePackage,
  packages,
  buyPackages,
  singleTestimonial,
  testimonials,
} from 'src/app/api-interfaces/home-page';
import { HomePageService } from 'src/app/api-services/home-page.services';

@Component({
  selector: 'app-shared-testimonial',
  templateUrl: './shared-testimonial.component.html',
  styleUrls: ['./shared-testimonial.component.scss'],
})
export class SharedTestimonialComponent implements OnInit, OnDestroy {
  
  isLive: boolean = true;

  testimonialsList: singleTestimonial[] | null;
  
  newtestimonialOptions: OwlOptions = {
    loop: false,
    margin: 10,
    nav: false,
    navText: ['', ''],
    stagePadding: 250,
    autoplayTimeout: 22000,
    autoplayHoverPause: true,
    // slideBy: '4',
    center: true,
    //  responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        autoplay: true,
        loop: true,
        nav: false,
      },
      600: {
        items: 1,
        nav: false,
      },
      1000: {
        items: 1,
        nav: false,
        autoplay: true,
        loop: true,
        margin: 30,
      },
    },
  };
  newtestimonialOptions1: OwlOptions = {
    margin: 15,
    nav: true,
    loop: true,
    navText: [
      "<div class='nav-button owl-prev'>‹</div>",
      "<div class='nav-button owl-next'>›</div>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  };
  testiOption: OwlOptions = {
    autoplay: true,
    smartSpeed: 1000,
    margin: 20,
    dots: false,
    nav: true,
    loop: true,
    autoplayHoverPause:true,
    center: true,
    // navText: [
    //   "<div class='nav-button owl-prev'>‹</div>",
    //   "<div class='nav-button owl-next'>›</div>",
    // ],
    // center: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1150: {
        items: 3,
      },
    },
  };
  constructor(
    private _homepageService: HomePageService,
    private _router: Router
  ) {}
  ngOnDestroy(): void {
    this.isLive = false;
  }

  ngOnInit(): void {
    this.loadAllData();
  }
  loadAllData() {
    this._homepageService
      .getAllTestimonialsList()
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (res: testimonials | null) => {
          //@ts-ignore
          this.testimonialsList = res?.Data as singleTestimonial[];
        },
        (err: any) => {
        }
      );
  }
}


