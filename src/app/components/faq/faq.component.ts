import { ViewportScroller, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { faq } from 'src/app/api-interfaces/aboutUs';
import { AboutusService } from 'src/app/api-services/aboutUs.services';
import { SeoService } from 'src/app/api-services/seo.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, AfterViewInit {
  accordion: string = 'accord';
  islive: boolean = true;
  faqdata: faq[];
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private metaTagService: Meta,
    private route: ActivatedRoute,
    private _about: AboutusService,
    private _seo: SeoService,
    private scroller: ViewportScroller,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    this.route.fragment.subscribe((res: any) => {
      this.router.navigate([], { fragment: res });
      this.scroller.scrollToAnchor(res);
      // const elm = `#${res}`;
      // document.querySelector(elm)?.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      // });
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accordinginit();
    }
    this.loadData();
    this._seo.getData(4).subscribe((res: any) => {
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
  }
  accordinginit() {
    $('.sg_accr_ctn').hide();
    $('.sg_according_btn h5').on('click', function () {
      const $this = $(this);
      $this.next().slideToggle();
      $this.toggleClass('active');
    });
  }
  loadData() {
    this._about
      .getFaq()
      .pipe(takeWhile(() => this.islive))
      .subscribe((res: any) => {
        if (res && res.is_success)
          //@ts-ignore
          this.faqdata = res.data.map((el: any) => {
            return {
              ...el,
              title: el.title.trim(),
              slug: el.title.trim().replaceAll(' ', '_'),
            };
          });
      });
  }
}
