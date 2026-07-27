import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEndPoint } from 'src/environments/environment';
import {
  buyPackages,
  contactUs,
  packages,
  partnerUs,
  robust,
  services,
  subjects,
  testimonials,
} from '../api-interfaces/home-page';
import { HelperService } from './helper.services';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  constructor(
    private _HttpClient: HttpClient,
    private _helper: HelperService
  ) { }
  getAllPackagesList() {
    const url = `${apiEndPoint}/packages-list`;
    return this._HttpClient.get<packages | null>(url);
  }
  getServiceById(id: number) {
    const url = `${apiEndPoint}/packages-list-by-serviceid/${id}`;
    return this._HttpClient.get<packages | null>(url);
  }
  getAllTestimonialsList() {
    const url = `${apiEndPoint}/testimonial-list`;
    return this._HttpClient.get<testimonials | null>(url);
  }
  getAllServiceTypeList() {
    const url = `${apiEndPoint}/servicetype-list`;
    return this._HttpClient.get<services | null>(url);
  }

  buyServicePackages(payload: buyPackages) {
    const url = `${apiEndPoint}/save-package-transaction-for-user`;
    return this._HttpClient.post<buyPackages | null>(url, payload, {
      headers: this._helper.apiHeader,
    });
  }
  saveContactUs(payload: contactUs) {
    const url = `${apiEndPoint}/save-contactus`;
    return this._HttpClient.post<contactUs | null>(url, payload, {
      headers: {},
    });
  }
  savePartnerUs(payload: FormData) {
    const url = `${apiEndPoint}/save-partner-with-us`;
    return this._HttpClient.post<partnerUs | null>(url, payload);
  }
  getSubjectForPartner() {
    const url = `${apiEndPoint}/get-subject-for-partner`;
    return this._HttpClient.get<subjects | null>(url);
  }
  getRobustProcess() {
    const url = `${apiEndPoint}/get-robust-process-list`;
    return this._HttpClient.get<robust | null>(url);
  }
  getUserDetails() {
    const url = `${apiEndPoint}/get-user-details-by-id/${this._helper.getUserId}`;
    return this._HttpClient.get<any | null>(url);
  }
  getAllForm() {
    const url = `${apiEndPoint}/create-Forms-GET-All`;
    return this._HttpClient.get<any>(url, {
      headers: this._helper.apiHeader,
    });
  }
  getAllpackageService() {
    const url = `${apiEndPoint}/Get-Package-Service`;
    return this._HttpClient.get<any>(url, {
      headers: this._helper.apiHeader,
    });
  }
  getFormById(id: number) {
    const url = `${apiEndPoint}/create-Forms-GETBy-Id?checkId=${id}`;
    return this._HttpClient.get<any>(url, {
      headers: this._helper.apiHeader,
    });
  }
  submitcheckForm(payload: any) {
    const url = `${apiEndPoint}/create-verification`;
    return this._HttpClient.post<any>(url, payload, {
      headers: this._helper.apiHeader,
    });
  }
}
