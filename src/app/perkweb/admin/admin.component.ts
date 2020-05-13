import { MENU_ITEMS } from "./admin-menu";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-admin",
  styleUrls: [],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class AdminComponent implements OnInit {
  menu = MENU_ITEMS;

  ngOnInit() {
    console.log("in parkweb admin ");
  }
}
