import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/api-services/auth.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { resendCodeTimer } from 'src/environments/environment';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnChanges {
  startingMinutes: number = resendCodeTimer;
  timer: string = '';
  timeInterval: any;
  @Input() Email: string;
  @Input() type: string;
  userEmail: string;
  isFPComp: boolean = false;
  constructor(
    private _authService: AuthService,
    private _toaster: ToasterService,
    private _route: ActivatedRoute
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if ('Email' in changes) {
      this.userEmail = changes.Email.currentValue;
    }
    if ('type' in changes) {
      this.isFPComp = changes?.type && changes.type.currentValue === 'fp';
    }
  }

  ngOnInit(): void {
    clearInterval(this.timeInterval);

    this.timeInterval = setInterval(() => {
      this.countdownTimer(Math.round(Number(this.startingMinutes)));
    }, 1000);
  }

  countdownTimer(time: number) {
    const m = Number(time);

    let mins = Math.floor(m / 60);
    let sec = m % 60;

    this.timer = `${mins < 10 ? '0' + mins : mins}:${
      sec < 10 ? '0' + sec : sec
    }`;
    this.startingMinutes--;
    if (this.startingMinutes <= 0) {
      this.startingMinutes = 0;
      clearInterval(this.timeInterval);
    }
  }
  resendCode() {
    if (this.userEmail) {
      let req!: Observable<any | null>;
      this.isFPComp &&
        (req = this._authService.ForgotPasswordOTPGenerate(this.userEmail));
      !this.isFPComp &&
        (req = this._authService.resendActivationCode(this.userEmail));
      req &&
        req.subscribe((res: any) => {
          if (res && res.IsSuccess) {
            clearInterval(this.timeInterval);
            this.startingMinutes = resendCodeTimer;

            this.timeInterval = setInterval(() => {
              this.countdownTimer(Math.round(Number(this.startingMinutes)));
            }, 1000);
            this._toaster.showSuccessToast(res.Message);
          } else this._toaster.showErrorToast(res.Message);
        });
    }
  }
}
