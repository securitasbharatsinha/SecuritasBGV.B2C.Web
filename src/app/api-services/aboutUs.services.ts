import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEndPoint } from 'src/environments/environment';
import { about, faq, partnerusData, teams } from '../api-interfaces/aboutUs';
import { HelperService } from './helper.services';

@Injectable({
  providedIn: 'root',
})
export class AboutusService {
  constructor(
    private _HttpClient: HttpClient,
    private _helper: HelperService
  ) {}

  getAboutus() {
    const url = `${apiEndPoint}/get-about-us-data`;
    return this._HttpClient.get<about | null>(url);
  }
  getFaq() {
    const url = `${apiEndPoint}/faq-list`;
    return this._HttpClient.get<faq | null>(url);
  }
  getTeams() {
    const url = `${apiEndPoint}/get-team-list`;
    return this._HttpClient.get<teams | null>(url);
  }
  getPartnerusContent() {
    const url = `${apiEndPoint}/get-partner-content-data`;
    return this._HttpClient.get<partnerusData | null>(url);
  }
}
