import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'number-conter',
  templateUrl: './number-conter.component.html',
  styleUrls: ['./number-conter.component.scss']
})

export class NumberConterComponent implements OnInit, OnChanges, AfterViewInit {
  @Input("number") number: any;
  @Input("unit") unit: any;
  // @Input("label") label!: string;
  // duration: number;

  //counter: string = "0";
  counter = new BehaviorSubject<string>("0");
  tempCounter: string = ''
  constructor() { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.number) {
      this.counterFunc();
    }
  }

  ngAfterViewInit() { }

  counterFunc() {
    let start = 0;
    let end = parseInt(String(this.number).substring(0, 3));

    if (start === end) {
      return;
    }

    // find duration per increment
    // let totalMilSecDur = this.duration;
    // let incrementTime = (totalMilSecDur / end) * 1;

    let timer = setInterval(() => {
      start += 1;
      if (String(this.number).includes('.')) {
        this.counter.next(String(start) + this.number.toString().substring(2));

      } else {
        this.counter.next(String(start) + this.number.toString().substring(3));

      }
      // this.tempCounter = String(start) + this.number.toString().substring(2)
      //this.counter = String(start) + this.number.toString().substring(3);
      if (start === end) {
        if (String(this.number).includes('.')) {
          if (this.number == this.tempCounter) {
            this.counter.next(String(this.number))
            clearInterval(timer);
          }
        }
        clearInterval(timer);
      }
    }, 80);
  }
}