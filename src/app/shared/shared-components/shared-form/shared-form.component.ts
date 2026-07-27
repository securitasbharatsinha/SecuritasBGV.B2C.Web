import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-form',
  templateUrl: './shared-form.component.html',
  styleUrls: ['./shared-form.component.scss'],
})
export class SharedFormComponent implements OnInit {
  @Input() type: string;
  constructor() {}

  ngOnInit(): void {}
}
