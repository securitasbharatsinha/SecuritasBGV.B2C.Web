import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { achievements } from 'src/app/api-interfaces/aboutUs';
import { AboutusService } from 'src/app/api-services/aboutUs.services';

@Component({
  selector: 'app-shared-achievements',
  templateUrl: './shared-achievements.component.html',
  styleUrls: ['./shared-achievements.component.scss'],
})
export class SharedAchievementsComponent implements OnInit, OnDestroy, AfterViewInit {
  achievements: achievements[];
  isLive: boolean = true;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,

    private _about: AboutusService,
    private renderer: Renderer2, private el: ElementRef, private cdr: ChangeDetectorRef
  ) { }
  ngAfterViewInit(): void {
    this.loadData()
    // if (this.achievements?.length) {
    //   this.achievements.forEach((el) => {
    //     document.getElementById(el?.title)?.setAttribute('data-count', el?.count)

    //   })
    // }
    // throw new Error('Method not implemented.');

  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.isLive = false
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // this.achivementCounter();
    }
    // this.loadData();
  }
  achivementCounter() {
    $(window).on('load', function () {
      var a = 0;
      if (document.getElementById('sg_achievement')) {
        //@ts-ignore
        var oTop = $('#sg_achievement').offset()!.top - window.innerHeight;
        // if (a == 0 && $(window).scrollTop()! > oTop) 

        if (true) {

          $('.sg_achievement_data').each(function () {

            var $this = $(this),
              sg_countTo = $this.attr('data-count');
            $({
              countNum: $this.text(),
            }).animate(
              {
                countNum: sg_countTo,
              },

              {
                duration: 4000,
                easing: 'swing',
                step: function () {
                  $this.text(Math.floor(+this.countNum));
                },
                complete: function () {
                  $this.text(this.countNum);
                },
              }
            );
          });
          a = 1;
        }
      }
    });
  }
  loadData() {
    this._about
      .getAboutus()
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res: any) => {
        //@ts-ignore
        this.achievements = res.data.achievements.map((el: achievements) => {
          return {
            ...el,
            // duration:Number(el.count)/
          }
        }) as achievements;
        if (isPlatformBrowser(this.platformId)) {
          // this.achivementCounter();
          this.achievements.forEach((el) => {
            this.updateDataCount(el)
            // document.getElementById(el?.title)?.setAttribute('data-count', el?.count)

          })
        }

      });
  }
  updateDataCount(el: any) {
    // Get the DOM element
    const element = this.el.nativeElement.querySelector(`#${el?.title.toLowerCase()}`);
    if (element) {
      this.cdr.detectChanges();
      // Set the data-count attribute
      this.renderer.setAttribute(element, 'data-count', el?.count);
    }
  }
}
