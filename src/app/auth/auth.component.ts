import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
   <app-header></app-header>
   <router-outlet></router-outlet>
   
  `,
  styles: [
  ]
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
