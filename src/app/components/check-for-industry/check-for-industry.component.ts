import { isPlatformBrowser } from '@angular/common';

import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';
import { checksForIndustry } from 'src/app/api-interfaces/securitas-services';
import { CommonChecksComponent } from './common-checks/common-checks.component';
import { SeoService } from 'src/app/api-services/seo.service';
import { Meta } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HelperService } from 'src/app/api-services/helper.services';
declare var Swiper: any;
@Component({
  selector: 'app-check-for-industry',
  templateUrl: './check-for-industry.component.html',
  styleUrls: ['./check-for-industry.component.scss'],
})
export class CheckForIndustryComponent implements OnInit, AfterViewInit {
  @ViewChild('placeholder', { read: ViewContainerRef, static: true })
  placeholder: ViewContainerRef;
  islive: boolean = true;
  checksForIndustry: checksForIndustry;
  testiOption: OwlOptions;
  industryType: number;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private _resolver: ComponentFactoryResolver,
    private _securitasService: SecuritasServiceService,
    private _seo: SeoService,
    private metaTagService: Meta,
    private _helper: HelperService
  ) {}
  ngAfterViewInit(): void {
    $(document).ready(function () {
      var swiper = new Swiper('.targetbuyers-swiper', {
        slidesPerView: 6,
        slidesPerGroup: 1,
        spaceBetween: 15,
        centeredSlides: false,
        speed: 1300,
        autoplay: true,
        disableOnInteraction: true,
        loop: true,
        slideToClickedSlide: true,
        allowTouchMove: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 7,
          },
          567: {
            slidesPerView: 3,
            spaceBetween: 7,
          },
          991: {
            slidesPerView: 3,
            spaceBetween: 7,
          },
          1250: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          1399: {
            slidesPerView: 6,
            spaceBetween: 15,
          },
        },
        creativeEffect: {
          prev: {
            shadow: !0,
            translate: ['-20%', 0, -1],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        },
      });
    });
    // this.testiOption = {
    //   // autoplay: true,
    //   // smartSpeed: 2000,
    //   margin: 5,
    //   dots: false,
    //   nav: true,
    //   loop: true,
    //   // navText: [
    //   //   "<div class='nav-button owl-prev'>‹</div>",
    //   //   "<div class='nav-button owl-next'>›</div>",
    //   // ],
    //   // center: true,
    //   responsive: {
    //     0: {
    //       items: 1,
    //     },
    //     576: {
    //       items: 1,
    //     },
    //     768: {
    //       items: 3,
    //     },
    //     1150: {
    //       items: 6,
    //     },
    //   },
    // };
  }
  ngOnInit(): void {
    this.industryType = Number(this._helper.getIndustryType);
    // this.placeholder.clear()
    if (isPlatformBrowser(this.platformId)) {
      this.route.fragment.subscribe((frg: any) => {

        this.jumpTo(frg);
      });
    }
    this._seo.getData(3).subscribe((res: any) => {
      this.metaTagService.addTags([
        {
          name: 'keywords',
          content: res.title,
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'About us' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
        { charset: 'UTF-8' },
      ]);
    });
    this.route.queryParams.subscribe((prm) => {
      // this.loadDynamicComponent(prm.checks)
    });
  }
  jumpTo(section: any) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
  loadDynamicComponent(id: number) {
    this._securitasService
      .getChecksForIndustryById(id)
      .pipe(takeWhile(() => this.islive))
      .subscribe((res) => {
        //@ts-ignore
        if (res && res.IsSuccess)
          //@ts-ignore
          this.checksForIndustry = res.Data as checksForIndustry;
        this.placeholder.clear();

        const compFactory = this._resolver.resolveComponentFactory(
          CommonChecksComponent
        );
        const comp = this.placeholder.createComponent(compFactory);
        comp.instance.checksForIndustry = this.checksForIndustry;
      });
  }
}
