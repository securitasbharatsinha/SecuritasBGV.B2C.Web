import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>

    <app-footer></app-footer>
  `,
  styles: [],
})
export class BaseComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
