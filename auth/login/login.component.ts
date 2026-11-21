import { Product } from "./../../../../products/models/product.model";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Inject,
  Output,
  EventEmitter
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";

import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import * as fromCart from "./../../../../cart/reducers";
import * as fromProduct from "./../../../../products/reducers";
import * as cart from "./../../../../cart/actions/cart.actions";
import * as product from "./../../../../products/actions/products.actions";
import { Store } from "@ngrx/store";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { mobile } from "@env/environment";
import { AppState } from "@app/reducers";

@Component({
  selector: "app-login",
  templateUrl: mobile
    ? "./login.component.mobile.html"
    : "./login.component.html",
  styleUrls: mobile
    ? ["./login.component.mobile.css"]
    : ["./login.component.css"]
})
export class LoginComponent implements OnChanges {
  loginuser;
  @Input() loginloaded;
  @Input() loginloading;
  @Input() loginfailure;
  @Input() signupinit;
  @Input() isUser;
  @Input() logoutStatus;
  @Input() userforgotloading;
  @Input() userforgotloaded;
  @Input() userforgotfailed;
  @Output() dologout: EventEmitter<any> = new EventEmitter();
  @Output() logindata: EventEmitter<any> = new EventEmitter();
  @Output() loginfailureEvent: EventEmitter<any> = new EventEmitter();
  @Output() signupformInvalidEvent: EventEmitter<any> = new EventEmitter();
  @Output() forgotData: EventEmitter<any> = new EventEmitter();
  @Output() resetvalues: EventEmitter<any> = new EventEmitter();
  @Output() userinfo: EventEmitter<any> = new EventEmitter();
  @Input() loginname;
  @Input() showforget;
  @Output() socialsignupdata: EventEmitter<any> = new EventEmitter();
  // @Input() socialloginloading;
  // @Input() socialloginloaded;
  // @Input() socialloginfailed;

  forgetpassword = false;
  loginSignUpPopup = true;
  overlaypupup = false;
  sendmail = false;
  sendmailhide = true;
  searchText;
  loginForm: FormGroup;
  signupForm: FormGroup;
  forgetPasswordForm: FormGroup;
  emptyforgotfields: boolean = false;
  emailinvalid: boolean;
  passwordinvalid: boolean;

  main_headers = {
    menuItemText: [],
    redirectLink: []
  };
  menu_icons = {
    iconLink: [],
    altText: [],
    redirectLink: []
  };
  subMenuVisible = false;
  subCategories: any[] = [];
  hoveredItem: string;
  haveSubCategories: any[] = [];
  selectedMenu;
  loginpopup;
  signuppopup;
  cartItemCount = 0;
  emptysignupfields = false;
  openmenustatus = false;
  allfield: boolean;
  signupemailinvalid: boolean;
  signupfirstnameinvalid: boolean;
  signuppassinvalid: boolean;
  FB: any;
  forgoteamil: any;
  wishlength: any;
  // socialsignupdata: any;
  constructor(
    public router: Router,
    private contentService: ContentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public store: Store<AppState>,
    private fb: FormBuilder,
    private cookieService: CookieService //private socialAuthService: AuthService
  ) {
    this.loginForm = fb.group({
      loginemail: [
        null,
        [Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")]
      ],
      loginpassword: [null, Validators.minLength(7)]
    });

    this.signupForm = fb.group({
      first_name: [null, [Validators.required, Validators.minLength(3)]],
      last_name: [null],
      signupemail: [
        null,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]
      ],
      signuppassword: [null, Validators.minLength(7)]
    });
    // this.cartItemCount = this.cartdetails.items;

    this.forgetPasswordForm = fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]
      ]
    });
  }

  resetformvalue(value) {
    this.forgoteamil = this.forgetPasswordForm.controls.email.value;
    //console.log(this.forgetPasswordForm);
    if (this.forgetPasswordForm.controls.email.status === "INVALID") {
      this.emptyforgotfields = true;
    }
    if (this.forgetPasswordForm.controls.email.status === "VALID") {
      this.resetvalues.emit(value);
      //   this.forgetPasswordForm = this.fb.group({
      //     'email' : [null]
      //  })
    }
  }
  ngOnChanges() {
    if (
      this.router.parseUrl(this.router.url).queryParams["search"] != undefined
    ) {
      //this.searchText = this.router.parseUrl(this.router.url).queryParams['search'];
    }
    if (this.isUser && this.isUser.email) {
      // this.cookieService.set('loginuser', this.isUser.email);
      //this.closePopup();
      this.logoutStatus = false;
    }
    if (this.cookieService.get("loginuser")) {
      this.loginuser = this.cookieService.get("loginuser");
      // console.log(this.loginuser);
    }
    //console.log(this.logoutStatus);
    if (this.logoutStatus) {
      this.loginuser = null;
      this.cookieService.remove("loginuser");
      this.logoutStatus = false;
    }
    if (this.loginfailure) {
      setTimeout(() => {
        this.loginfailureEvent.emit();
        this.emailinvalid = false;
        this.passwordinvalid = false;
        this.clearmessages();
      }, 3000);
    }
  }

  clearmessages() {
    this.passwordinvalid = false;
    this.loginfailure = false;
    this.emailinvalid = false;
    this.signupemailinvalid = false;
    this.signuppassinvalid = false;
    this.signupfirstnameinvalid = false;
    this.emptyforgotfields = false;
  }
  menuEntered($event) {
    this.selectedMenu = $event.target.innerText;
    $event.target.classList.add("active");
  }

  logout() {
    this.dologout.emit();
    // this.loginuser = null;
    // location.reload();
  }
  loginformCapturedValues(value) {
    // console.log(this.loginForm);
    // console.log(value);
    if (this.loginForm.controls.loginemail.status === "INVALID") {
      this.emailinvalid = true;
    }
    if (this.loginForm.controls.loginpassword.status === "INVALID") {
      this.passwordinvalid = true;
    }
    if (this.loginForm.status === "VALID") {
      this.logindata.emit(value);
    }
  }

  getConvertedMenu(data, keys) {
    return data.filter(res => res.key === keys)[0];
  }
  loginPopupOpen() {
    this.loginSignUpPopup = true;
    this.loginpopup = true;
    this.signuppopup = false;
    this.overlaypupup = true;
    this.forgetpassword = false;
    this.sendmailhide = true;
    this.sendmail = false;
  }
  forgetclick() {
    this.loginSignUpPopup = false;
    this.loginpopup = false;
    this.signuppopup = false;
    this.forgetpassword = true;
    this.overlaypupup = true;
  }

  ngOnInit() {}

  // public socialSignIn(socialPlatform: string) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     let socialPlatformProvider;
  //     if (socialPlatform == "facebook") {
  //       socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
  //     } else if (socialPlatform == "google") {
  //       socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
  //     }

  //     this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
  //       //console.log(socialPlatform + " sign in data : ", userData);
  //       //console.log(userData.email);
  //       // Now sign-in with userData

  //       this.socialsignupdata.emit(userData);
  //     });
  //   }
  // }
}
