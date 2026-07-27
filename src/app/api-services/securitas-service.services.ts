import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEndPoint } from 'src/environments/environment';
import {
  checksForIndustry,
  knowHow,
  knowWhy,
} from '../api-interfaces/securitas-services';
import { HelperService } from './helper.services';

@Injectable({
  providedIn: 'root',
})
export class SecuritasServiceService {
  constructor(
    private _HttpClient: HttpClient,
    private _helper: HelperService
  ) {}

  getKnowWhyListById(id: number) {
    const url = `${apiEndPoint}/service-cause-details/${id}`;
    return this._HttpClient.get<knowWhy | null>(url, {
      headers: this._helper.apiHeader,
    });
  }
  getKnowHowListById(id: number) {
    const url = `${apiEndPoint}/service-process-details/${id}`;
    return this._HttpClient.get<knowHow | null>(url, {
      headers: this._helper.apiHeader,
    });
  }
  getAllChecksForIndustryList() {
    const url = `${apiEndPoint}/check-for-industry-list`;
    return this._HttpClient.get<checksForIndustry | null>(url);
  }
  getChecksForIndustryById(id: number) {
    const url = `${apiEndPoint}/check-for-industry-by-industryid/${id}`;
    return this._HttpClient.get<checksForIndustry | null>(url, {
      headers: this._helper.apiHeader,
    });
  }
}
