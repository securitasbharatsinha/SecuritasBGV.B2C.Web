// import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewportScroller, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { services } from 'src/app/api-interfaces/home-page';
import { knowHow, knowWhy } from 'src/app/api-interfaces/securitas-services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';
import { servicelist } from './service-list';
// import { servicelist } from '../../service-list';
@Component({
  selector: 'app-securitas-services',
  templateUrl: './securitas-services.component.html',
  styleUrls: ['./securitas-services.component.scss'],
})
export class SecuritasServicesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('instant_verification') instant_verification: ElementRef;
  @ViewChild('digital_verification') digital_verification: ElementRef;
  @ViewChild('matrimonial_due_diligence') matrimonial_due_diligence: ElementRef;
  isAddedCart: boolean = false;
  knowWhy: knowWhy;
  knowHow: knowHow;
  serviceTypeId: number;
  islive: boolean = true;
  serviceLists: any[] = [];
  selectedService: any = [];
  servicesTypesList: any[] = [];
  prices: any = {
    instant: 0,
    digital: 0,
    helper: 0,
    employee: 0,
    tenant: 0,
  };
  allServices: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private _securitasService: SecuritasServiceService,
    private _payment: PaymentService,
    private _router: Router,
    private scroller: ViewportScroller,

    private _homepageService: HomePageService,
    private _elementRef: ElementRef,
    private _render: Renderer2
  ) {}
  ngOnDestroy(): void {
    this.islive = false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // this.serviceLists = servicelist;

      this.service_checks();
      this.route.fragment.subscribe((frg: any) => {
        this.jumpTo(frg);
      });
      this.getAllServiceTypes();
    }
    this.route.queryParams.subscribe((prm) => {
      this.serviceTypeId = prm.service;
      this.loadData();
    });
  }
  service_checks() {
    $(function () {
      $('.sg_shrt_dtal').hide();

      $('.show_shrt_dtal').on('click', function () {
        $(this).parent().parent().next('.sg_shrt_dtal').slideToggle();
      });

      $('#domestic_helper').on('click', function () {
        if (!$('#domestic_helper').is(':checked')) {
          $('.domestic_helper_input input').prop('checked', false);
        } else {
          $('.domestic_helper_input input').prop('checked', true);
        }
      });

      $('#baby_sitter').on('click', function () {
        if (!$('#baby_sitter').is(':checked')) {
          $('.baby_sitter_input input').prop('checked', false);
        } else {
          $('.baby_sitter_input input').prop('checked', true);
        }
      });

      $('#driver').on('click', function () {
        if (!$('#driver').is(':checked')) {
          $('.driver_input input').prop('checked', false);
        } else {
          $('.driver_input input').prop('checked', true);
        }
      });

      $('#tution_teacher').on('click', function () {
        if (!$('#tution_teacher').is(':checked')) {
          $('.tution_teacher_input input').prop('checked', false);
        } else {
          $('.tution_teacher_input input').prop('checked', true);
        }
      });

      $('#h_tenant_verification').on('click', function () {
        if (!$('#h_tenant_verification').is(':checked')) {
          $('.h_tenant_verification_input input').prop('checked', false);
        } else {
          $('.h_tenant_verification_input input').prop('checked', true);
        }
      });
    });
  }
  getAllServiceTypes() {
    this._homepageService
      .getAllServiceTypeList()
      .pipe(takeWhile(() => this.islive))
      .subscribe(
        (res: services | null) => {
          if (res && res.IsSuccess) {
            //@ts-ignore
            this.servicesTypesList = res.Data as services;
          }
        },
        (err: any) => {
        }
      );
  }

  loadData() {
    return;
    this._securitasService
      .getKnowWhyListById(this.serviceTypeId)
      .pipe(takeWhile(() => this.islive))
      .subscribe(
        (res: any) => {
          if (res) this.knowWhy = res.data;
        },
        (err: any) => {
        }
      );
    this._securitasService
      .getKnowHowListById(this.serviceTypeId)
      .pipe(takeWhile(() => this.islive))
      .subscribe(
        (res: any) => {
          if (res) this.knowHow = res.data;
        },
        (err: any) => {
        }
      );
  }
  ngAfterViewInit(): void {
    this.route.fragment.subscribe((res: any) => {
      const elm = document.getElementById(res);
      elm && elm.scrollIntoView({ behavior: 'smooth' });

      // this._router.navigate([], { fragment: res });
      // this.scroller.scrollToAnchor(res);
      // const elm = `#${res}`;
      // document.querySelector(elm)?.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      // });
    });
  }
  jumpTo(section: any) {
    // const elm = this._elementRef.nativeElement.querySelector(`#${section}`);
    // elm && elm.scrollIntoView({ behavior: 'smooth' });

    const elm = document.getElementById(section);
    elm && elm.scrollIntoView({ behavior: 'smooth' });
  }
  selectService($event: any) {}
  buyNow() {
    this._payment.createOrder(500, 1);
  }
  goToCart() {
    if (this.isAddedCart) {
      this._router.navigate(['/cart'], { queryParams: { cart: true } });
    }
  }
  getServiceId(name: string) {
    if (name) {
      let service = this.servicesTypesList.find((d) => d.service_link === name);

      return service;
      // return service?.servicetype_id;
    }
  }
}
