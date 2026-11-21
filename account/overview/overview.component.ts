import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { CookieService } from "ngx-cookie";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { mobile } from "@env/environment";
import { Title } from '@angular/platform-browser';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as user from "../../../../user/actions/user.actions";

@Component({
  selector: "app-overview",
  templateUrl: mobile
    ? "./overview.component.mobile.html"
    : "./overview.component.html",
  styleUrls: mobile
    ? ["./overview.component.mobile.css"]
    : ["./overview.component.css"]
})
export class OverviewComponent implements OnInit, OnChanges {

  @Input() logoutStatus;
  @Output() dologout: EventEmitter<any> = new EventEmitter();
  showDropdown: boolean;

  constructor(private cookieService: CookieService, private fb: FormBuilder,
    private route: Router, private location: Location, private store: Store<any>, public title: Title) {
      this.title.setTitle('Overview | Pantone');
 
}
ngOnInit() {
  
}

ngOnChanges() {
  
}

  /**
   * logout and navigate to last page
   * @method logOut
   */
  public logOut() {
    this.store.dispatch(new user.UserLogout());
    // this.location.back();
    this.route.navigate(['/']);
  }

  showDropMenu(){
    this.showDropdown = !this.showDropdown;
  }
}
