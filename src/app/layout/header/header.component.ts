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
import * as $ from 'jquery';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { take, takeWhile } from 'rxjs/operators';
import { services } from 'src/app/api-interfaces/home-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { observable, Observable } from 'rxjs';
import { AuthService } from 'src/app/api-services/auth.services';
import { checksForIndustry } from 'src/app/api-interfaces/securitas-services';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';
import { CookieService } from 'ngx-cookie-service';
import {
  clientRoleId,
  COOKIE_DOMAIN,
  financeHeadUserId,
  financeUserId,
  getPortalFinanceHead,
  getPortalinvoice,
  getPortalSanction,
  sanctionUserId,
} from 'src/environments/environment';
import { HelperService } from 'src/app/api-services/helper.services';
import { CartService } from 'src/app/api-services/cart.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { getPortalPath } from 'src/environments/environment';
import { PaymentService } from 'src/app/api-services/payment.services';
import { COOKIE_ATTRS } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  // faCoffee = faCoffee;
  activeFragment: any;
  isLive: boolean = true;
  servicesList: services | null;
  checksForIndustryList: checksForIndustry[] | null;
  contactForm: FormGroup;
  isLoggedin: boolean;
  authObj: any;
  userDetails: any;
  initials: string;
  getPortalPath: string = getPortalPath('');
  getPortalinvoice: string = getPortalinvoice('');
  getPortalFinanceHead: string = getPortalFinanceHead('');
  getPortalSanction: string = getPortalSanction('');
  financeUserId: any = financeUserId;
  financeHeadUserId: any = financeHeadUserId;
  walletBalance: any;
  clientRoleId: number = clientRoleId
  isSpecialWindow: boolean;
  isSubmitted: boolean = false;
  isCLient: any;
  actionGroup: FormGroup;
  currentURL: string;
  greyHeaderPage: any = ['/verify-yourself', '/helper-verification', '/tenant-verification', '/matrimonial-due-diligence', '/instant-verify', '/supplier-connect', "/contact-us"]
  loginUrls: any = ['/auth/signup', '/auth/login']
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _fb: FormBuilder,
    private wowService: NgwWowService,
    private route: ActivatedRoute,
    private router: Router,
    private _homepageService: HomePageService,
    private _secutitasService: SecuritasServiceService,
    private _authService: AuthService,
    private _cookie: CookieService,
    private _helperSerice: HelperService,
    private _toaster: ToasterService,
    private _payment: PaymentService
  ) {
    this.isSpecialWindow = this.router.url.includes('special')
    this.isLoggedin = this._helperSerice.isLoggedIn;
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mouseOverOnLink();
      this.navbarInit();
    }
  }
  ngOnDestroy(): void {
    this.isLive = false;
  }

  ngOnInit(): void {
    this.currentURL = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentURL = event.url;
      }
    });
    this.isCLient = this._helperSerice.getClientId
    this.contactForm = this._fb.group({
      Name: ['', [Validators.required, Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')]],
      SurName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')]],
      Email: ['', [Validators.required,Validators.email,Validators.pattern(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]@)[a-zA-Z0-9._-]+@(?![.-])(?!.*[.-]{2})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],      
      Phone: ['', [Validators.required,
        Validators.pattern('^[6-9][0-9]{9}$'),
        Validators.maxLength,
        Validators.minLength]],
       Message: ['', [Validators.required]],
    });
    this.loadData();
    // this.getWallet();
    // this._payment.reloadWallet.subscribe((val) => {
    //   if (val && val.reload) this.getWallet();
    // });

    if (isPlatformBrowser(this.platformId)) {
      this.route.fragment.subscribe((frg: any) => {
        this.activeFragment = frg;
      });
      this.wowService.init();
      this.openModal();
    }
  }
  onNameInput(event: any) {
    let value = event.target.value;
  
    // Allow only alphabets & space
    value = value.replace(/[^a-zA-Z ]/g, '');
  
    // Remove multiple spaces
    value = value.replace(/\s+/g, ' ');
  
    // Trim left space
    value = value.replace(/^\s+/, '');
  
    // Capitalize each word
    value = value
      .split(' ')
      .map((word: string) =>
        word ? word[0].toUpperCase() + word.substring(1).toLowerCase() : ''
      )
      .join(' ');
  
    this.contactForm.controls['Name'].setValue(value, { emitEvent: false });
  }
  onSurnameInput(event: any) {
    let value = event.target.value;
  
    // Allow only alphabets & space
    value = value.replace(/[^a-zA-Z ]/g, '');
  
    // Remove multiple spaces
    value = value.replace(/\s+/g, ' ');
  
    // Trim left space
    value = value.replace(/^\s+/, '');
  
    // Capitalize each word
    value = value
      .split(' ')
      .map((word: string) =>
        word ? word[0].toUpperCase() + word.substring(1).toLowerCase() : ''
      )
      .join(' ');
  
    this.contactForm.controls['SurName'].setValue(value, { emitEvent: false });
  }
  onInput(event: any) {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, '');
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      this.contactForm.controls['Phone'].setValue(value, { emitEvent: false });
      event.target.value = value;
  }
  // getWallet() {
  //   this._payment
  //     .getWallet()
  //     .pipe(take(1))
  //     .subscribe((res: any) => {
  //       if (res && res.is_success) {
  //         this.walletBalance = res.data[0]?.AvailableBalance ?? 0;
  //       }
  //     });
  // }
  loadData() {
    this.isLoggedin &&
      this._homepageService
        .getUserDetails()
        .pipe(takeWhile(() => this.isLive))
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess) {
              this.userDetails = res.Data;

              this._helperSerice.uDetails.next(res.Data);
              this._helperSerice.user = res.Data;
              this.initials =
                this.userDetails?.FName?.charAt(0)?.toUpperCase() +
                this.userDetails?.MName?.charAt(0)?.toUpperCase() +
                this.userDetails?.LName?.charAt(0)?.toUpperCase();
            }
          },
          (err: any) => {
          }
        );
    this._homepageService
      .getAllServiceTypeList()
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (res: services | null) => {
          //@ts-ignore
          this.servicesList = res as services;
        },
        (err: any) => {
        }
      );
    this._secutitasService
      .getAllChecksForIndustryList()
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (res: checksForIndustry | null) => {
          //@ts-ignore
          this.checksForIndustryList = res.Data as checksForIndustry;
        },
        (err: any) => {
        }
      );
  }
  mouseOverOnLink() {
    if (isPlatformBrowser(this.platformId) && this.checksForIndustryList) {
      var e2 = <HTMLElement>document.querySelector('#menu_2');

      e2.addEventListener('mouseenter', function (e) {
        $('.sg_menu_ctn').removeClass('active');
        $('#menu_22').addClass('active');
      });
    }
  }
  navbarInit() {
    $(window).on('scroll', function () {
      var scrollDown = $(this).scrollTop();
      if (scrollDown! > 45) {
        $('.navbar').addClass('sticky-top shadow-sm');
        $('.sg-cart-mdl').addClass('pt-3');
        $('.sg-cart-mdl').removeClass('pt-5');
        // $(".navbar-brand img").attr("src", "assets/img/logo_b.png");
      } else {
        $('.navbar').removeClass('sticky-top shadow-sm');
        $('.sg-cart-mdl').addClass('pt-5');
        $('.sg-cart-mdl').removeClass('pt-3');
        // $(".navbar-brand img").attr("src", "assets/img/logo_b.png");
      }
    });

    // Dropdown on mouse hover
    const $dropdown = $('.dropdown');
    const $dropdownToggle = $('.dropdown-toggle');
    const $dropdownMenu = $('.dropdown-menu');
    const showClass = 'show';

    $('#menu_1').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_11').addClass('active');
    });

    $('#menu_2').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_22').addClass('active');
    });

    $('#menu_3').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_33').addClass('active');
    });

    $('#menu_4').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_44').addClass('active');
    });

    $('#menu_5').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_55').addClass('active');
    });

    $('#menu_6').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_66').addClass('active');
    });

    $('#menu_7').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_77').addClass('active');
    });

    $('#menu_8').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_88').addClass('active');
    });

    $('#menu_9').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      $('#menu_99').addClass('active');
    });

    $('#menu_10').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      // $('#menu_99').addClass('active');
    });

    $('#menu_12').on('mouseenter', function () {
      $('.sg_menu_ctn').removeClass('active');
      // $('#menu_99').addClass('active');
    });

    if (window.matchMedia('(max-width: 991px)').matches) {
      $('.sg_menu_nav .dropdown-toggle').on('click', function () {
        $(this).next('.dropdown-menu').slideToggle(1000);
        $(this).next('.dropdown-menu').toggleClass('show');
      });
    }
  }
  openModal() {
    $(document).on('ready', function () {
      $('.sg_slide_tag').animate(
        {
          width: '100%',
        },
        3000
      );
      setTimeout(function () {
        $('.onload_slide').hide();
      }, 4000);

      $('.company_user .sg_all_steps_done').trigger('click', function () {
        $('#sg_step7_modal .company_user .progress-bar').animate(
          {
            width: '100%',
          },
          {
            duration: 3000,
            step: function (now, fx) {
              if (fx.prop == 'width') {
                $(this).html(Math.round(now * 100) / 100 + '%');
              }
            },
          }
        );
      });

      $('.customer_user .sg_all_steps_done').trigger('click', function () {
        $('#sg_step7_modal .customer_user .progress-bar').animate(
          {
            width: '100%',
          },
          {
            duration: 3000,
            step: function (now, fx) {
              if (fx.prop == 'width') {
                $(this).html(Math.round(now * 100) / 100 + '%');
              }
            },
          }
        );
      });
    });
  }
  sendMessage() {
    this.isSubmitted = true;
    if (this.contactForm.valid) {
      this._homepageService.saveContactUs(this.contactForm.value).subscribe(
        (res: any) => {
          if (res && res.IsSuccess) {
            this._toaster.showSuccessToast(res.Message);
            this.contactForm.reset();
            this.isSubmitted = false;
          }
        },
        (err: any) => {
        }
      );
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
  loginlogout(isLogged: boolean) {
    if (isLogged) {
      // document.cookie = `sessionauth=; domain=${COOKIE_DOMAIN}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `sessionauth=; ${COOKIE_ATTRS} expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      this._cookie.deleteAll();
      this._toaster.showSuccessToast('Logout successfully.');
      this.isLoggedin = this._helperSerice.isLoggedIn;
      this.router.navigate([!this.isSpecialWindow ? '/' : '/special/login']);
      this._helperSerice.isLoggedOut.next(true);
    } else {
      this.router.navigate([!this.isSpecialWindow ? '/auth' : '/special/login']);
    }
  }
  getTag(roleid: number) {
    switch (roleid) {
      case 2:
        return 'Individual';
      case 4:
        return 'Corporate';
      case 1:
        return 'Admin';
      case 5:
        return 'Finance';
      case 6:
        return 'Finance Head';
      case 7:
        return 'Sanctions';
      case 8:
        return 'Client';
      default:
        return '';
    }
  }
  goToAbout() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = window.location.origin + '/about';
      // this.router.navigateByUrl('/about');
    }
  }
  openDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  
    const parent = (event.target as HTMLElement).closest('.nav-item.dropdown');
    parent?.classList.toggle('active');
  }
  getPath(roleId: any) {
    if (roleId == financeUserId) {
      return this.getPortalinvoice
    } else if (roleId == financeHeadUserId) {
      return this.getPortalFinanceHead
    }
    else if (roleId == sanctionUserId) {
      return this.getPortalSanction
    }
    else {
      return this.getPortalPath
    }
  }
}
