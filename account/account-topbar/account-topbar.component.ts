import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { mobile } from "@env/environment";
@Component({
  selector: "app-account-topbar",
  templateUrl: mobile
    ? "./account-topbar.component.mobile.html"
    : "./account-topbar.component.html",
  styleUrls: mobile
    ? ["./account-topbar.component.mobile.css"]
    : ["./account-topbar.component.css"]
})
export class AccountTopbarComponent implements OnInit, OnChanges {
  @Input() userprofileInfo;
  fname: string;
  lname: string;
  email: string;
  constructor(private cookieservice: CookieService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.userprofileInfo) {
      this.fname = this.userprofileInfo.first_name;
      this.lname = this.userprofileInfo.last_name;
      this.email = this.userprofileInfo.email;
    }
  }
}
