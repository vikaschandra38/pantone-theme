import { Component, OnInit, OnChanges } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { Store } from "@ngrx/store";
import * as fromUser from "@app/user/reducers";
import * as fromProduct from "@app/products/reducers";

import * as user from "@app/user/actions/user.actions";
import { mobile } from "@env/environment";
import { AppState } from '@app/reducers';
import { Meta, Title } from "@angular/platform-browser";


@Component({
  selector: "app-account",
  templateUrl: mobile
    ? "./account.component.mobile.html"
    : "./account.component.html",
  styleUrls: mobile
    ? ["./account.component.mobile.css"]
    : ["./account.component.css"]
})
export class AccountComponent implements OnInit, OnChanges {
  wishlistloaded: any;
  wishlist: any;

  constructor(
    private cookieservice: CookieService,
    public store: Store<AppState>,
    public title: Title
  ) {
    this.title.setTitle('My Account');
  }

  ngOnInit() {}

  ngOnChanges() {}

  show_price_details(event) {
    const el = event.currentTarget;
    el.classList.toggle("minusiconchange");
    if (el.nextSibling.style.display === "block") {
      el.nextSibling.style.display = "none";
    } else {
      el.nextSibling.style.display = "block";
    }
  }

  // userProfileSubmit(event) {
  //   console.log(event);
  //   this.store.dispatch(new user.UserProfileSubmit(event));
  // }
}
