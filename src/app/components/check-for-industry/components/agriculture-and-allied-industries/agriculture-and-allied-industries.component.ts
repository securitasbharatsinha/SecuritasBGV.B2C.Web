import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { checksForIndustry } from 'src/app/api-interfaces/securitas-services';
import { SecuritasServiceService } from 'src/app/api-services/securitas-service.services';

@Component({
  selector: 'app-agriculture-and-allied-industries',
  templateUrl: './agriculture-and-allied-industries.component.html',
  styleUrls: ['./agriculture-and-allied-industries.component.scss']
})
export class AgricultureAndAlliedIndustriesComponent implements OnInit {
  islive: boolean=true;
  checksForIndustry: checksForIndustry;

  constructor(
    private _securitasService:SecuritasServiceService,
    private _route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe((prm)=>{
    if(prm && prm.checks)
      this.loadData(prm.checks)
    })
  }
  loadData(id:number){
    this._securitasService.getChecksForIndustryById(id).pipe(takeWhile(()=>this.islive)).subscribe((res)=>{
      //@ts-ignore
      if(res && res.IsSuccess)
      //@ts-ignore
      this.checksForIndustry = res.Data as checksForIndustry
    })
  }
}
