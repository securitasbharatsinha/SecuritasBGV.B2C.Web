import { Component, Input, OnInit } from '@angular/core';
import { checksForIndustry } from 'src/app/api-interfaces/securitas-services';

@Component({
  selector: 'app-common-checks',
  templateUrl: './common-checks.component.html',
  styleUrls: ['./common-checks.component.scss']
})
export class CommonChecksComponent implements OnInit {
@Input()checksForIndustry:checksForIndustry
  constructor() { }

  ngOnInit(): void {
  }

}
