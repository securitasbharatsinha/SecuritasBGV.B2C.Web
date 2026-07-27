import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeWhile } from 'rxjs/operators';
import { HelperService } from 'src/app/api-services/helper.services';
import { ConfirmationMadalComponent } from 'src/app/shared/shared-components/confirmation-madal/confirmation-madal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
  isCartAdded: boolean = false;
  dynamicComp: ComponentRef<ConfirmationMadalComponent>;
  @ViewChild('placeholder', { read: ViewContainerRef, static: true })
  placeholder: ViewContainerRef;
  willOpen: boolean = false;
  storageCartItems: any;
  currentYear: number;
  isSpecialWindow: boolean;
  isLogout: boolean = true
  isLive: boolean = true;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public _helper: HelperService,
    private _cfr: ComponentFactoryResolver,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.isSpecialWindow = this.router.url.includes('special')

  }
  ngOnDestroy(): void {
    this.isLive = false
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // this.isLoggedIn = this._helper.isLoggedIn
    this._helper.isLoggedOut
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res) => {

        if (!res && this._helper.isLoggedIn) {
          this.isLogout = false
        }
        if (res && !this._helper.isLoggedIn) {
          this.isLogout = true
        }
      })
    if (isPlatformBrowser(this.platformId)) {
      this.currentYear = new Date().getFullYear();

      this.cartModalActions();
      this.storageCartItems = localStorage.getItem('cartItems');
      const items = JSON.parse(this.storageCartItems);
      items?.length ? '' : localStorage.removeItem('isReadyToBuy');
    }
  }
  isAddedInCart(e: any) {
    this.isCartAdded = e;
  }
  willModalOpen(e: any) {
    this.willOpen = e;
    if (e) this.openConfirmationModal();
  }
  cartModalActions() {
    // var boxWidth = 380;
    $('.sg-cart-open').on('click', function () {
      // $('.sg-cart-mdl').animate({
      //   width: boxWidth,
      // });
      $('.sg_cart_modal').toggleClass('active');
      $('.sg-cart-mdl').toggleClass('active');
      // $('.sg_cart_modal').css('display', 'block');
    });
    $('.sg_cart_modal_cls').on('click', function () {
      // $('.sg-cart-mdl').animate({
      //   width: boxWidth,
      // });
      $('.sg_cart_modal').removeClass('active');
      $('.sg-cart-mdl').removeClass('active');

      // $('.sg_cart_modal').css('display', 'none');
    });
  }
  openConfirmationModal() {
    if (
      this.willOpen &&
      this._helper.isLoggedIn &&
      localStorage.getItem('isReadyToBuy') === 'true' &&
      JSON.parse(this.storageCartItems ?? '').length
    ) {
      setTimeout(() => {
        // this.placeholder.clear();
        // let compFactory = this._cfr.resolveComponentFactory(
        //   ConfirmationMadalComponent
        // );
        // this.dynamicComp = this.placeholder.createComponent(compFactory);
        const myPopupRef = this.modalService.open(ConfirmationMadalComponent, {
          size: 'xl',
          centered: true,
          backdrop: 'static',
        });
        myPopupRef.result.then(
          (result) => { },
          (error) => { }
        );
      }, 1000);
    }
  }

  // About Page Reload
  goToAbout(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = window.location.origin + url;
      // this.router.navigateByUrl('/about');
    }
  }
  // loggedIn(): boolean {
  //   return !this._helper.isLoggedIn
  // }
}
