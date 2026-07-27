import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Inject,
  PLATFORM_ID,

} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Meta } from '@angular/platform-browser';
import { NgwWowService } from 'ngx-wow';
import * as $ from 'jquery';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'new-securitas-universal';
  isHideFooter: boolean = false;
  comp:any

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private metaTagService: Meta,
    private wowService: NgwWowService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.slideLoader();
      // this.showLoader()
      this.wowService.init();
      // this.mousePointer();
   
      this._router.events.subscribe((event: any) => {
        if (event && event.url) {
          this.isHideFooter =
            event.url === '/auth' ||
            event.url === '/auth/login' ||
            event.url === '/auth/signup';
         
        }
      });
    }
  }
  mousePointer() {
    var sg_cursor = <HTMLElement>document.querySelector('.sg_cursor');
    var sg_cursorinner = <HTMLElement>document.querySelector('.sg_cursor2');
    var a = document.querySelectorAll('a');

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      sg_cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    });

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      sg_cursorinner.style.left = x + 'px';
      sg_cursorinner.style.top = y + 'px';
    });

    document.addEventListener('mousedown', function () {
      sg_cursor.classList.add('click');
      sg_cursorinner.classList.add('sg_cursorinnerhover');
    });

    document.addEventListener('mouseup', function () {
      sg_cursor.classList.remove('click');
      sg_cursorinner.classList.remove('sg_cursorinnerhover');
    });

    a.forEach((item) => {
      item.addEventListener('mouseover', () => {
        sg_cursor.classList.add('sg_hover');
      });
      item.addEventListener('mouseleave', () => {
        sg_cursor.classList.remove('sg_hover');
      });
    });
  }
  slideLoader() {
    $('.sg_slide_tag').animate(
      {
        width: '100%',
      },
      3000
    );
    setTimeout(function () {
      $('.onload_slide').hide();
    }, 4000);
  }
  showLoader() {
    // Loder js Spinner
    var spinner = function () {
      setTimeout(function () {
        if ($('#spinner').length > 0) {
          $('#spinner').removeClass('show');
        }
      }, 1);
    };
    spinner();
  }
  changeOfRoutes($event: any) {
  }
}

