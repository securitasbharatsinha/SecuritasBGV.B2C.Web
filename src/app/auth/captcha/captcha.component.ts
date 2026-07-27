import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {
  captcha: string;
  captchaText: string;
  isCaptchaMatched: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const chars = '0123456789';
    // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZadcdefghijklmnopqrstuvwxyz0123456789';
    const captchaLength = 5;
    let captcha = '';
    for (let i = 0; i < captchaLength; i++) {
      const index = Math.floor(Math.random() * chars.length);
      captcha += chars[index];
    }
    this.captchaText = captcha;
  }
  // matchCaptcha(e: any) {
  //   this.isCaptchaMatched = (e.target.value === this.captchaText)
  // }
  get CaptchaMatched() {
    return this.captcha === this.captchaText
  }
}
