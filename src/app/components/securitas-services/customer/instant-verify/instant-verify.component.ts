import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import {
  packages,
  packageService,
  singlePackage,
} from 'src/app/api-interfaces/home-page';
import { knowHow, knowWhy } from 'src/app/api-interfaces/securitas-services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { PaymentService } from 'src/app/api-services/payment.services';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';
import { servicelist } from '../../service-list';

@Component({
  selector: 'app-instant-verify',
  templateUrl: './instant-verify.component.html',
  styleUrls: ['./instant-verify.component.scss'],
})
export class InstantVerifyComponent implements OnInit, OnDestroy {
  isAddedCart: boolean = false;
  knowWhy: knowWhy;
  knowHow: knowHow;
  @Input() serviceTypeId: number;
  // @Output() servicesPackagesdata = new EventEmitter<any[]>();
  servicesPackagesdata: any[];
  // serviceTypeId: number;
  islive: boolean = true;
  serviceLists: any;
  selectedService: any[] = [];
  prices: any = {
    instant: 0,
    digital: 0,
    helper: 0,
    employee: 0,
    tenant: 0,
  };
  selectedPackageServiceIds: number[] = [];
  totalAmount = 0;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private _securitasService: SecuritasServiceService,
    private _payment: PaymentService,
    private _home: HomePageService,
    private _router: Router
  ) {}
  ngOnDestroy(): void {
    this.islive = false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.serviceLists = servicelist;

      this.service_checks();
      this.route.fragment.subscribe((frg: any) => {
        this.jumpTo(frg);
      });
    }
    // this.route.queryParams.subscribe((prm) => {
    //   this.serviceTypeId = prm.service;
    //   // this.loadData();
    // });

    this.loadData();
  }
  service_checks() {
    $(function () {
      $('.sg_shrt_dtal').hide();

      //   $('.baby_sitter_input').hide();
      //   $('.driver_input').hide();

      //   $("#domestic_helper").on( "click", function(){
      //       if ( ! $("#domestic_helper").is(':checked') ) {
      //         $('.domestic_helper_input').slideUp();
      //       } else{
      //         $('.domestic_helper_input').slideDown();
      //     }
      //   });

      //   $("#baby_sitter").on( "click", function(){
      //     if ( ! $("#baby_sitter").is(':checked') ) {
      //       $('.baby_sitter_input').slideUp();
      //     } else{
      //       $('.baby_sitter_input').slideDown();
      //   }
      // });

      //   $("#driver").on( "click", function(){
      //     if ( ! $("#driver").is(':checked') ) {
      //       $('.driver_input').slideUp();
      //     } else{
      //       $('.driver_input').slideDown();
      //   }
      // });

      // $('.show_shrt_dtal').on('click', () => {
      //   $(this).parent().parent().next('.sg_shrt_dtal').slideToggle();
      // });
      // $('.show_shrt_dtal').on('click', () => {
      //   $(this).parent().parent().next('.sg_shrt_dtal').slideToggle();
      // });

      // $('.sg_pkg_pnt_icn')parent('.sg_shadow').addClass('sg_pkg_pnt_div');
      $('.sg_pkg_pnt_icn').parent('.sg_shadow').addClass('sg_pkg_pnt_div');

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
  loadData() {
    if (this.serviceTypeId) {
      // this._securitasService
      //   .getKnowWhyListById(this.serviceTypeId)
      //   .pipe(takeWhile(() => this.islive))
      //   .subscribe(
      //     (res: any) => {
      //       if (res) this.knowWhy = res.data;
      //     },
      //     (err: any) => {
      //     }
      //   );
      // this._securitasService
      //   .getKnowHowListById(this.serviceTypeId)
      //   .pipe(takeWhile(() => this.islive))
      //   .subscribe(
      //     (res: any) => {
      //       if (res) this.knowHow = res.data;
      //     },
      //     (err: any) => {
      //     }
      //   );
      this._home
        .getServiceById(this.serviceTypeId)
        .pipe(takeWhile(() => this.islive))
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess) {
              //@ts-ignore
              this.servicesPackagesdata = res.Data.map((el: any) => {
                return {
                  ...el,
                  isSelected: false,
                };
              });
            }
            // this.servicesPackagesdata = res.Data.find(
            //   (d: any) => d.package_name === 'À la carte'
            // ) as singlePackage;
          },
          (err: any) => {
          }
        );
    }
  }
  jumpTo(section: any) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
  selectService($event: any) {
    const id: number = $event.target.value;

    //@ts-ignore
    const singleService = this.servicesPackagesdata.packageServices.find(
      (d: any) => {
        return d.package_service_id == id;
      }
    );

    if ($event.target.checked) {
      this.selectedPackageServiceIds.push(id);
      //@ts-ignore
      this.totalAmount += singleService?.service_price;
    } else {
      this.selectedPackageServiceIds.splice(
        this.selectedPackageServiceIds.indexOf(id),
        1
      );
      //@ts-ignore
      this.totalAmount -= singleService?.service_price;
    }
  }
  buyNow() {
    //   this.serviceTypeId,
    //   this.servicesPackagesdata.package_id,
    //   this.selectedPackageServiceIds,
    //   this.totalAmount
    // );
    // this._payment.createOrder(
    //   this.totalAmount,
    //   this.servicesPackagesdata.package_id,
    //   this.serviceTypeId,
    //   this.selectedPackageServiceIds
    // );
  }
  goToCart() {
    if (this.isAddedCart) {
      this._router.navigate(['/cart'], { queryParams: { cart: true } });
    }
  }
}
