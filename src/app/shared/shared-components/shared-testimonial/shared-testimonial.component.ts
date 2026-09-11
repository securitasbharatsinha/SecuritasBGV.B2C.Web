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
import { ToasterService } from 'src/app/api-services/toaster.services';

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
    public _router: Router,
    private _toaster: ToasterService
  ) {}

    isSendingEnquiry = false;

      // Phone: typing me hi sirf digits, 10 tak
  onlyDigits(ev: any) {
    const el = ev.target;
    const clean = (el.value || '').replace(/[^0-9]/g, '').slice(0, 10);
    if (el.value !== clean) el.value = clean;
  }

  // Naam: sirf letters aur space
  onlyLetters(ev: any) {
    const el = ev.target;
    const clean = (el.value || '').replace(/[^A-Za-z ]/g, '');
    if (el.value !== clean) el.value = clean;
  }
  submitCtaForm(ctaForm: any) {
    if (ctaForm?.invalid) {
      this._toaster.showErrorToast('Please fill all required fields');
      return;
    }
    if (this.isSendingEnquiry) return;
    this.isSendingEnquiry = true;
    const v = ctaForm.value;
    const payload = {
      Name: v.firstName || '',
      SurName: v.lastName || '',
      Email: v.email || '',
      Phone: v.phone || '',
      Message: v.message || '',
    };
    this._homepageService
      .saveContactUs(payload as any)
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (res: any) => {
          this.isSendingEnquiry = false;
          this._toaster.showSuccessToast('Thank you! We will reach out to you shortly.');
          ctaForm.resetForm();
        },
        () => {
          this.isSendingEnquiry = false;
          this._toaster.showErrorToast('Something went wrong. Please try again.');
        }
      );
  }
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


