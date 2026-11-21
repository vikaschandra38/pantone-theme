import { Component, OnInit, OnChanges } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { mobile } from "@env/environment";
@Component({
  selector: "app-account-sidebar",
  templateUrl: mobile
    ? "./account-sidebar.component.mobile.html"
    : "./account-sidebar.component.html",
  styleUrls: mobile
    ? ["./account-sidebar.component.mobile.css"]
    : ["./account-sidebar.component.css"]
})
export class AccountSidebarComponent implements OnInit, OnChanges {
  list: any;
  selected: any;
  constructor(private cookieservice: CookieService) {}
  select(item) {
    this.selected = item;
  }
  isActive(item) {
    return this.selected === item;
  }

  ngOnInit() {}
  empty_address() {}

  ngOnChanges() {}
  OrderReturn() {}
}
