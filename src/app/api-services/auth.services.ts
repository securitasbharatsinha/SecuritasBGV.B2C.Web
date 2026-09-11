import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { api } from 'src/environments/environment';
import { apiEndPoint } from 'src/environments/environment';
import { signUp } from '../api-interfaces/auth-page';
import { login } from '../api-interfaces/home-page';
function getWindow(): any {
  return window;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _HttpClient: HttpClient,
    private _cookie: CookieService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return getWindow();
    }
  }
  postUserData(payload: signUp) {
    const url = `${apiEndPoint}/save-user`;
    return this._HttpClient.post<signUp | null>(url, payload);
  }

  validateActivationCode(payload: any) {
    const url = `${apiEndPoint}/validate-activationcode`;
    return this._HttpClient.post<any | null>(url, payload);
  }
  resendActivationCode(Email: any) {
    const url = `${apiEndPoint}/resend-activationcode?Email=${Email}`;
    return this._HttpClient.get<any | null>(url);
  }
  ForgotPasswordOTPGenerate(Email: any) {
    const url = `${apiEndPoint}/ForgotPasswordOTPGenerate?Email=${Email}`;
    return this._HttpClient.get<any | null>(url);
  }
  isEmailExists(Email: string) {
    const url = `${apiEndPoint}/isexistsEmail?Email=${Email}`;
    return this._HttpClient.get<any | null>(url);
  }
  isGSTExists(gst: string) {

    const url = `${apiEndPoint}/get-IsGSTCompany-by-GST/${gst}`;
    return this._HttpClient.get<any | null>(url);

  }
  resetPassword(obj: any) {
    const url = `${apiEndPoint}/validateForgotPasswordOTPGenerate?Email=${obj.Email}&OTP=${obj.OTP}&Password=${obj.Password}`;
    return this._HttpClient.get<any | null>(url);
  }
  login(req: login) {
    const url = `${apiEndPoint}/validate-user`;
    return this._HttpClient.post<any | null>(url, req);
  }
  loginWithOTP(req: login, otp: string) {
    const url = `${apiEndPoint}/OtpVerification?Email=${req?.Email}&Otp=${otp}`;
    return this._HttpClient.get<any | null>(url);
  }
  sendOtp(email: string) {
    const url = `${apiEndPoint}/SendOtp?Email=${email}`;
    return this._HttpClient.get<any | null>(url);
  }
  doAuth(username: string, password: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams({
      fromObject: {
        username, // "dummyUser",
        password, // "dummy@123",
        grant_type: 'password',
      },
    });
    return this._HttpClient.post(api(`signin`), body.toString(), {
      headers,
    });
  }
  
  generateOrderId(id: string, secretkey: string, payload: any) {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Basic ' + window.btoa(`${id}:${secretkey}`))
      .set('Access-Control-Allow-Origin', '*');

    return this._HttpClient.post(
      'https://api.razorpay.com/v1/orders',
      payload,
      {
        headers,
      }
    );
  }
  getPostalAddress(code: string) {
    const url = `https://api.postalpincode.in/pincode/${code}`;
    return this._HttpClient.get<any | null>(url);
  }
}
