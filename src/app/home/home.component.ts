import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  HostListener,

} from '@angular/core';
import {Router} from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Meta } from '@angular/platform-browser';
import { NgwWowService } from 'ngx-wow';
import * as $ from 'jquery';
import { HomePageService } from '../api-services/home-page.services';
import { takeWhile } from 'rxjs/operators';
import {
  packages,
  robust,
  services,
  singlePackage,
  singleTestimonial,
  testimonials,
} from '../api-interfaces/home-page';
import { SeoService } from '../api-services/seo.service';
import { HelperService } from '../api-services/helper.services';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  
    bannerTexts: string[] = [
    "Cook",
    "Driver",
    "Caregiver",
    "Individual",
    "tenant",
    "Matrimonial",
  ];
  packagesList: singlePackage[] | null;
  // testimonialsList: singleTestimonial[] | null;
  servicesList: services['Data'];
  robustList: robust[];
  serviceTypeId: number | null;
  firstServieTab: string;
  firstServieTabId: number;
  bannerImg: string = '/assets/img/Banner-1.png' ;

   bannerText: string = "";
  currentIndex: number = 1;
  bannerIndex: number = 1;
  totalImages: number = 3;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    nav: true,
    margin: 0,
    smartSpeed: 1000,
    // navSpeed: 100,
    navText: [
      '<img src="/assets/img/a_left.svg">',
      '<img src="/assets/img/a_right.svg">',
    ],
    autoplay: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    // nav: false,
  };


  service_slider: OwlOptions = {
    loop: true,
    // mouseDrag: false,
    // touchDrag: false,
    // pullDrag: false,
    dots: false,
    nav: false,
    margin: 10,
    autoplayHoverPause: true,

    smartSpeed: 2000,
    autoplayTimeout: 2000,
    // slideSpeed : 2000,
    // navSpeed: 100,
    // navText: ['<img src="/assets/img/a_left.svg">', '<img src="/assets/img/a_right.svg">'],
    autoplay: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      991: {
        items: 4,
      },
      1250: {
        items: 6,
      },
    },
    // nav: false,
  };
  pro_service: OwlOptions = {
    loop: true,
    margin: 12,
    items: 8,
    // responsiveClass: true,
    responsive: {
      0: {
        items: 2,
        autoplay: true,
        loop: true,
        nav: false,
        dots: false,
      },
      600: {
        items: 4,
        nav: false,
        loop: true,
        autoplay: true,
        dots: false,
      },
      1000: {
        items: 8,
        nav: true,
        autoplay: false,
        loop: true,
      },
      1250: {
        margin: 19,
        items: 8,
        nav: true,
        autoplay: false,
        loop: false,
        // autoWidth: true,
        // center: true,
      },
    },
  };
  dmy = {
    loop: true,
    margin: 5,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 8,
      },
    },
  };
  easyWithUsOptions = {
    loop: false,
    margin: 0,
    center: true,
    items: 5,
    responsiveClass: true,
    dots: false,
    responsive: {
      0: {
        items: 3,
        autoplay: false,
        loop: true,
        nav: true,
      },
      600: {
        items: 2,
        nav: true,
      },
      1000: {
        items: 5,
        nav: true,
        center: true,
        autoplay: false,
        loop: true,
      },
    },
  };
  // testimonialOptions: OwlOptions = {
  //   autoplay: true,
  //   smartSpeed: 4000,
  //   margin: 20,
  //   dots: false,
  //   nav: true,
  //   loop: true,
  //   navText: ['', ''],
  //   // center: true,
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     576: {
  //       items: 1,
  //     },
  //     768: {
  //       items: 1,
  //     },
  //     1150: {
  //       items: 1,
  //     },
  //   },
  // };
  isLive: boolean = true;
  isLast: Boolean = false;

  sliderInterval: any;
  scannerInterval: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private metaTagService: Meta,
    private wowService: NgwWowService,
    private _homepageService: HomePageService,
    private _seo: SeoService,
    @Inject(DOCUMENT) private dom: Document,
    private _router: Router,
    private _helperSerice: HelperService,

  ) { }
  ngOnDestroy(): void {
    this.isLive = false;
    clearInterval(this.scannerInterval);
    clearInterval(this.sliderInterval);
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // document.getElementById('instant_verify-tab0')?.classList.add('active');
      // var next = $('.loopbox .active').removeClass('active').next();
      // if (next.length) {
      //   $(next).addClass('active');
      // } else {
      //   $('#sat0').addClass('active');
      // }
      this.sliderInterval = setInterval(() => {
        var next = $('.loopbox .active').next();
        if(this.isLast){
          $('.loopbox .active').removeClass('active')
          this.isLast = false;
        }
        else{
          next = $('.loopbox .active').next();
          if (next.length) {
            $(next).addClass('active');
            if(next.length === 4) this.isLast = true;
          } else {
            $('#sat0').addClass('active');
          }
        }
      }, 2000);
      // this.scannerInterval = setInterval(() => {
      //   let preNo = 0;
      //   const no = () => Math.floor(Math.random() * 5) + 1;
      //   preNo === no()
      //     ? no()
      //     : (this.bannerImg = `/assets/img/Website-Banner-${no()}.png`);
      // }, 5000);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // this.bannerImg = '/assets/img/Website-Banner-5.png';
      this.wowService.init();

      this.chatModal();
      this.backToTop();
      this.dropdownServices();
      this.showLoader();
      this.setrandomBanner();

      // var vid = document.getElementById('myVideo');
      // //@ts-ignore
      // vid.muted = true;
      // //@ts-ignore
      // vid.play();
    }
    this.bannerText = this.bannerTexts[0];
    this._seo.getData(1).subscribe((res: any) => {
      this.metaTagService.addTags([
        {
          name: 'keywords',
          content: res.title,
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Home' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
        { charset: 'UTF-8' },
      ]);
    });
    // this.metaTagService.addTags([
    //   {
    //     name: 'keywords',
    //     content: 'Securitas, Securitas-India',
    //   },
    //   { name: 'robots', content: 'index, follow' },
    //   { name: 'author', content: 'Rohit Bhardwaj' },
    //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //   { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
    //   { charset: 'UTF-8' },
    // ]);
    this.loadAllData();


    let url = ''
    let link: HTMLLinkElement = this.dom.querySelector("link[rel='canonical']") || this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');

    const baseUrl = this.dom.location.origin;
    link.setAttribute('href', url || baseUrl + this.dom.location.pathname);

    if (!link.parentNode) {
      this.dom.head.appendChild(link);
    }
  }
backgroundPosition: string = 'center 0px';
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const offset = window.pageYOffset;
    // Adjust speed factor here (0.5 = slower movement)
    const speed = 0.5;
    this.backgroundPosition = `center ${offset * speed}px`;
  }

  loadChatling(): void {
    if (document.getElementById('chatling-embed-script')) return;
  
    const script = document.createElement('script');
    script.src = 'https://chatling.ai/js/embed.js';
    script.async = true;
    script.type = 'text/javascript';
    script.id = 'chatling-embed-script';
    script.setAttribute('data-id', '3591523672'); // 👈 Your Chatling ID
    document.body.appendChild(script);
  }
  
  loadAllData() {

    // this._homepageService
    //   .getAllPackagesList()
    //   .pipe(takeWhile(() => this.isLive))
    //   .subscribe(
    //     (res: packages | null) => {
    //       //@ts-ignore
    //       this.packagesList = res?.Data;
    //     },
    //     (err: any) => {
    //     }
    //   );
    this._homepageService
      .getRobustProcess()
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (res: robust | null) => {
          //@ts-ignore
          this.robustList = res?.data as robust[];
        },
        (err: any) => {
        }
      );
    this._homepageService
      .getAllServiceTypeList()
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (res: services | null) => {
          if (res && res.Data) {
            //@ts-ignore
            this.servicesList = res.Data.filter(
              (el) => el.servicetype_id != 2
            ).map((el: any) => {
              return {
                ...el,
                service_name: el.service_name,
                // .replace(/ \([\s\S]*?\)/g, '')
                // .trim(),
              };
            });

            //@ts-ignore
            this.serviceTypeId = this.servicesList[0].servicetype_id;

            //@ts-ignore
            this.firstServieTab = this.servicesList[0].service_name;
            //@ts-ignore
            this.firstServieTabId = this.servicesList[0].servicetype_id;
          }
        },
        (err: any) => {
        }
      );
  }

  backToTop() {
    // Back to top button
    $(window).on('scroll', function () {
      if ($(this).scrollTop()! > 300) {
        $('.back-to-top').fadeIn();
      } else {
        $('.back-to-top').fadeOut();
      }
    });
    $('.back-to-top').on('click', function () {

      $('html, body').animate(
        {
          scrollTop: 0,
        },
        100
      );
      return false;
    });
  }
  chatModal() {
    $('.sg_chat_btn').on('click', function () {

      $('.sg_chat_modal').css('display', 'block');
    });

    $('.sg_close_chat').on('click', function () {
      $('.sg_chat_modal').css('display', 'none');
    });

    $('.sg_dropdown_toggle').on('click', function () {
      $('.sg_search_drop').toggleClass('active');
      // $("div").click(function(){
      //     $(".sg_search_drop").removeClass("active");
      // });
    });
  }
  dropdownServices() {
    // dropdown tab js

    const sg_select = document.querySelectorAll('.sg_selected_option');
    const sg_option = document.querySelectorAll('.sg_drpoption');
    let index = 1;

    sg_select.forEach((a) => {
      a.addEventListener('click', (b: any) => {
        const next = b?.target.nextElementSibling;
        next.classList.toggle('toggle');
        next.style.zIndex = index++;
      });
    });
    sg_option.forEach((a) => {
      a.addEventListener('click', (b: any) => {
        b?.target.parentElement.classList.remove('toggle');

        const parent = b.target.closest('.sg_select_div').children[0];
        parent.setAttribute('data-type', b.target.getAttribute('data-type'));
        parent.innerText = b.target.innerText;
      });
    });

    $('ul.sg_option_dropdown').on('click', function () {
      $('.sg_option_dropdown').removeClass('toggle');
    });

    $('ul.sg_option_dropdown li button').on('click', function () {
      var innerTxt = $(this).text();
    });
  }
  getId(serviceName: any = '') {
    //  document.getElementById('selectedService')!.innerHTML = serviceName
  }
  getIcon(service: string) {
    switch (service) {
      case 'instant_verification':
        return { 'bi bi-qr-code-scan fa-3x': true };
      case 'digital_verification':
        return { 'bi bi-person-bounding-box fa-3x': true };
      case 'matrimonial_due_diligence':
        return { 'bi bi-search-heart fa-3x': true };
      case 'tenant_verification':
        return { 'bi bi-person-check fa-3x': true };
      case 'helper_verification':
        return { 'bi bi-card-checklist fa-3x': true };
      case 'business_employee_verification':
        return { 'bi bi-people fa-3x': true };
      case 'leadership_due_diligence':
        return { 'bi bi-upc-scan fa-3x': true };
      case 'vendor_due_diligence_(vdd)':
        return { 'bi bi-journal-check fa-3x': true };

      default:
        return { 'bi bi-journal-check fa-3x': true };
    }
  }
  showLoader() {
    // Loder js Spinner
    // var spinner = function () {
    //   setTimeout(function () {
    //     if ($('#spinner').length > 0) {
    //       $('#spinner').removeClass('show');
    //     }
    //   }, 1);
    // };
    // spinner();
  }
typingInterval: any;

typeText(fullText: string) {
  this.bannerText = "";
  let i = 0;

  // Clear any previous typing animation
  if (this.typingInterval) {
    clearInterval(this.typingInterval);
  }

  this.typingInterval = setInterval(() => {
    this.bannerText += fullText.charAt(i);
    i++;
    if (i >= fullText.length) {
      clearInterval(this.typingInterval);
    }
  }, 80); 
}
  animateClass = 'fade-in';
  setrandomBanner() {
    setInterval(() => {
      this.animateClass = '';
      if (this.bannerIndex >= 6){
        this.bannerIndex = 0
      } 
      this.bannerIndex++;
      this.bannerImg = `/assets/img/Banner-${this.bannerIndex}.png`;
      this.typeText(this.bannerTexts[this.bannerIndex - 1]);
      setTimeout(() => {
      this.animateClass = 'fade-in';
      }, 50);
    }, 5000);
  }

  nextBanner() {
    this.currentIndex++;
    if (this.currentIndex > this.totalImages) {
      this.currentIndex = 1;
    }
    this.bannerImg = `/assets/img/SecuritasIndiaBackgroundVerification-${this.currentIndex}.png`;
    this.typeText(this.bannerTexts[this.currentIndex - 1]);
  }

  previousBanner() {
    this.currentIndex--;
    if (this.currentIndex < 1) {
      this.currentIndex = this.totalImages;
    }
    this.bannerImg = `/assets/img/SecuritasIndiaBackgroundVerification-${this.currentIndex}.png`;
    this.typeText(this.bannerTexts[this.currentIndex - 1]);
  }
  
  gotoVerification(){
    if(this.isLoggedIn()) this._router.navigate(['/individual']);
    else if(!this.isLoggedIn()) this._router.navigate(['/verify-yourself']);
  }

  isLoggedIn(){
    return this._helperSerice.isLoggedIn;
  }
}