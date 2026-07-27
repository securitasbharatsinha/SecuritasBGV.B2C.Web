import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Meta } from '@angular/platform-browser';
import { NgwWowService } from 'ngx-wow';
// import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { AboutusService } from 'src/app/api-services/aboutUs.services';
import { takeWhile } from 'rxjs/operators';
import { about, teams } from 'src/app/api-interfaces/aboutUs';
import { SeoService } from 'src/app/api-services/seo.service';

declare var Swiper: any;
declare var $: any; 
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  
  slideConfig = {
    // variableWidth: true,
    // centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    dots: true,
    arrows: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  heroes: any = [
    {
      title: 'Great savings for a Ceria Raya',
      description:
        'Get 2 family lines for the price of 1 exclusively this Raya. Limited. time only. Copy up to 2 lines.',
      imgSrc:
        'https://www.theborneopost.com/newsimages/2022/05/PPLA-Awareness-1200x1200px_3-Unlimited-Lines-1.jpg',
      link: 'google.com',
    },
    {
      title: 'iPhone 13 Pro. Even more Pro',
      description:
        'Now in Alpine Green. Pair & Save up to RM2,320 with Celcom MEGA™ today',
      imgSrc: 'https://pbs.twimg.com/media/EQjNSZRXYAA3Nv8.jpg',
      link: 'google.com',
    },
    {
      title: 'iPhone 13 Pro. Even more Pro',
      description:
        'Now in Alpine Green. Pair & Save up to RM2,320 with Celcom MEGA™ today',
      imgSrc: 'https://pbs.twimg.com/media/FTq3iHkUAAAtJ0R.jpg',
      link: 'google.com',
    },
    {
      title: 'iPhone 13 Pro. Even more Pro',
      description:
        'Now in Alpine Green. Pair & Save up to RM2,320 with Celcom MEGA™ today',
      imgSrc:
        'https://www.theborneopost.com/newsimages/2022/05/PPLA-Awareness-1200x1200px_3-Unlimited-Lines-1.jpg',
      link: 'google.com',
    },
    {
      title: 'iPhone 13 Pro. Even more Pro',
      description:
        'Now in Alpine Green. Pair & Save up to RM2,320 with Celcom MEGA™ today',
      imgSrc: 'https://pbs.twimg.com/media/EQjNSZRXYAA3Nv8.jpg',
      link: 'google.com',
    },
  ];
  testimonialOptions: OwlOptions = {
    autoplay: true,
    smartSpeed: 2000,
    margin: 20,
    dots: false,
    nav: true,
    loop: true,
    navText: ['', ''],
    // center: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1150: {
        items: 1,
      },
    },
  };
  teamOptions: OwlOptions = {
    autoplay: true,
    smartSpeed: 2000,
    margin: 20,
    dots: false,
    nav: true,
    navText: ['', ''],
    loop: true,
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
        items: 4,
      },
    },
  };
  aboutusData: about;
  teamsData: teams[];
  isLive: boolean = true;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private metaTagService: Meta,
    private wowService: NgwWowService,
    private Http: HttpClient,
    private _about: AboutusService,
    private _seo: SeoService
  ) {}
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const $labels = $('.labels');
        const $loadingBar = $('.loading-bar');
  
        const labelsReady = $labels.length && $labels.children().length;
        const loadingReady = $loadingBar.length && $loadingBar.children().length;
  
        if (labelsReady && loadingReady && $.fn.slick) {
          if (!$labels.hasClass('slick-initialized')) {
            $labels.slick({
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              arrows: false,
              fade: true,
              draggable: false,
              asNavFor: '.loading-bar'
            });
          }
          if (!$loadingBar.hasClass('slick-initialized')) {
            $loadingBar.slick({
              centerMode: true,
              dots: false,
              infinite: true,
              speed: 300,
              slidesToShow: 5,
              slidesToScroll: 1,
              focusOnSelect: true,
              asNavFor: '.labels',
              responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 567,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
            });
          }
        }
      }, 0);
    }
  }
  ngOnDestroy(): void {
    this.isLive = false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.wowService.init();
      this.timelineSlider();
      // this.achivementCounter();
    }
    this.loadData();
    this._seo.getData(2).subscribe((res: any) => {
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
    // this.Http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe(
    //   (res: any) => {
    //     this.metaTagService.addTags([
    //       {
    //         name: 'keywords',
    //         content: res.title,
    //       },
    //       { name: 'robots', content: 'index, follow' },
    //       { name: 'author', content: 'Rohit Bhardwaj' },
    //       { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //       { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
    //       { charset: 'UTF-8' },
    //     ]);
    //   }
    // );
    // this.metaTagService.addTags([
    //   {
    //     name: 'keywords',
    //     content: 'Securitas, Securitas-India, About, About us',
    //   },
    //   { name: 'robots', content: 'index, follow' },
    //   { name: 'author', content: 'Rohit Bhardwaj' },
    //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //   { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
    //   { charset: 'UTF-8' },
    // ]);
  }

  loadData() {
    this._about
      .getAboutus()
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        //@ts-ignore
        this.aboutusData = res.data as about;
      });
    this._about
      .getTeams()
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {
        //@ts-ignore
        this.teamsData = res.data as teams;
      });
  }
  timelineSlider() {
    $(document).ready(function () {
      var swiper = new Swiper('.sg_timeline_slider', {
        // slidesPerView: 4,
        spaceBetween: 10,
        loop: false,
        // grabCursor: !0,
        // effect: "creative",
        speed: 900,
        autoplay: true,
        margin: 10,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        breakpoints: {
          768: {
            slidesPerView: 2,
            // spaceBetween: 10
          },
          991: {
            slidesPerView: 2,
            // spaceBetween: 8,
          },
          1280: {
            slidesPerView: 3,
            // spaceBetween: 10,
          },
          1366: {
            slidesPerView: 4,
            // spaceBetween: 10,
          },
        },
        // creativeEffect: {
        //   prev: {
        //     shadow: !0,
        //     translate: ["-20%", 0, -1],
        //   },
        //   next: {
        //     translate: ["100%", 0, 0],
        //   },
        // },
      });
    });
  }
}
