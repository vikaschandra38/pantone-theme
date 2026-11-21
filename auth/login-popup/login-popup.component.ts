import { Product } from "./../../../../products/models/product.model";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { mobile } from "@env/environment";
import { isPlatformBrowser } from "@angular/common";
import { OtpProcessService } from '@app/otp/otp-process.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-login-popup",
  templateUrl: mobile
    ? "./login-popup.component.mobile.html"
    : "./login-popup.component.html",
  styleUrls: mobile
    ? ["./login-popup.component.mobile.css"]
    : ["./login-popup.component.css"]
})
export class LoginPopupComponent implements OnChanges, OnInit {
  // loginuser;
  @Input() overlaypupup = false;
  @Input() loginpopup = false;
  @Input() loginSignUpPopup = false;
  @Input() loginfailure;
  @Input() signupfailure;
  @Input() loginloading;
  // @Input() socialloginloading;
  // @Input() socialloginloaded;
  // @Input() socialloginfailed;
  @Input() signupinit;
  @Input() signupsuccess;
  @Input() getforgotpasswordloaded;
  @Input() loginloaded;
  @Input() signuppopup;
  @Input() forgetpassword = false;
  @Input() userforgotloading;
  @Input() userforgotloaded;
  @Input() userforgotfailed;
  @Input() miniCart: boolean = false;
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() logindata: EventEmitter<any> = new EventEmitter();
  @Output() signupdata: EventEmitter<any> = new EventEmitter();
  @Output() resetvalues: EventEmitter<any> = new EventEmitter();
  @Output() loginfailureEvent: EventEmitter<any> = new EventEmitter();
  @Output() forgotClicked: EventEmitter<any> = new EventEmitter();
  @Output() onSignupInvalid: EventEmitter<any> = new EventEmitter();
  @Output() userinfo: EventEmitter<any> = new EventEmitter();
  @Output() socialsignupdata: EventEmitter<any> = new EventEmitter();
  @Output() onSignUpPopupOpen: EventEmitter<any> = new EventEmitter();
  @Output() loginPopupOpen: EventEmitter<any> = new EventEmitter();
  @Output() closeForget: EventEmitter<any> = new EventEmitter();

  loginForm: FormGroup;
  signupForm: FormGroup;
  forgetPasswordForm: FormGroup;
  emailinvalid: boolean;
  passwordinvalid: boolean;
  signupemailinvalid: boolean;
  signupfirstnameinvalid: boolean;
  signuppassinvalid: boolean;
  emptyforgotfields: boolean = false;
  forgoteamil: any;
  emptysignupfields = false;
  show: boolean = true;
  hid: boolean = false;
  loginuser: string;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private cookieService: CookieService,
    //private socialAuthService: AuthService,
    @Inject(PLATFORM_ID) private platform: Object,
    private otpProcessService: OtpProcessService,
    public title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Signup | Pantone')
    this.removedStoredItems();
    this.buildForm();
    this.subscribeResponse();
    if (this.cookieService.get("loginuser")) {
      this.loginuser = this.cookieService.get("loginuser");
      // console.log(this.loginuser);
    }
    if(this.loginuser && this.router.url === '/login'){
      this.router.navigate(["/"]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.cookieService.get("loginuser")) {
      this.loginuser = this.cookieService.get("loginuser");
      // console.log(this.loginuser);
    }
    if(this.loginuser && this.router.url === '/login'){
      this.router.navigate(["/"]);
    }

    if (
      this.getforgotpasswordloaded &&
      changes.hasOwnProperty("getforgotpasswordloaded")
    ) {
      this.forgetclick();
    }

    if (this.loginfailure) {
      setTimeout(() => {
        this.loginfailureEvent.emit();
        this.emailinvalid = false;
        this.passwordinvalid = false;
        this.clearmessages();
      }, 3000);
    }
    if (this.signupsuccess && !this.signupfailure) {
      this.emptysignupfields = false;
      this.onClosePopup();
    }
    if (this.loginloaded || this.signupsuccess) {
      console.log("loginloaded");
      this.userinfo.emit();
    }
  }

  showclick(input: any): any {
    this.show = false;
    this.hid = true;
    input.type = input.type === "password" ? "text" : "password";
  }
  hideclick(input: any): any {
    this.hid = false;
    this.show = true;
    input.type = input.type === "text" ? "password" : "text";
  }

  buildForm() {
    this.loginForm = this.fb.group({
      loginemail: [
        null,
        [Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")]
      ],
      loginpassword: [null, Validators.minLength(7)]
    });

    this.signupForm = this.fb.group({
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

    this.forgetPasswordForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]
      ]
    });
  }

  onClosePopup() {
    this.removedStoredItems();
    this.closePopup.emit();
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('popup-hidden');
  }

  loginformCapturedValues(value) {
   
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

  // public socialSignIn(socialPlatform: string) {
  //   if (isPlatformBrowser(this.platform)) {
  //     let socialPlatformProvider;
  //     if (socialPlatform == "facebook") {
  //       socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
  //     } else if (socialPlatform == "google") {
  //       socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
  //     }

  //     this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
  //       console.log(socialPlatform + " sign in data : ", userData);
  //       console.log(userData.email);
  //       // Now sign-in with userData

  //       this.socialsignupdata.emit(userData);
  //     });
  //   }
  // }

  signupPopupOpen() {
    this.onSignUpPopupOpen.emit();
  }

  signupformCapturedValues(value) {
    if (this.signupForm.controls.signupemail.status === "INVALID") {
      this.signupemailinvalid = true;
    }
    if (this.signupForm.controls.first_name.status === "INVALID") {
      this.signupfirstnameinvalid = true;
    }
    if (this.signupForm.controls.signuppassword.status === "INVALID") {
      this.signuppassinvalid = true;
    }
    if (this.signupForm.status === "VALID") {
      // this.emptysignupfields = false;
      this.signupdata.emit(value);
    } else {
      //this.emptysignupfields = true;
    }
  }

  checkSignupFormdata() {
    if (this.signupForm.status === "VALID") {
      // this.emptysignupfields = false;
    }
    if (this.signupForm.status === "INVALID") {
      this.emptysignupfields = true;
      if (this.signupinit) {
        this.onSignupInvalid.emit();
      }
    }
  }

  clearmessages() {
    this.passwordinvalid = false;
    this.loginfailure = false;
    this.emailinvalid = false;
    this.signupemailinvalid = false;
    this.signuppassinvalid = false;
    this.signupfirstnameinvalid = false;
    this.signupfailure = false;
    this.emptyforgotfields = false;
  }

  forgetclick() {
    this.forgotClicked.emit();
  }

  resetformvalue(value) {
    this.forgoteamil = this.forgetPasswordForm.controls.email.value;
    if (this.forgetPasswordForm.controls.email.status === "INVALID") {
      this.emptyforgotfields = true;
    }
    if (this.forgetPasswordForm.controls.email.status === "VALID") {
      this.resetvalues.emit(value);
    }
  }

  onLoginPopupOpen() {
    this.loginPopupOpen.emit();
  }

  onCloseForget() {
    this.closeForget.emit();
  }


  // login with otp process starts here


  /**
   * @method subscribeResponse
   */
  public subscribeResponse() {
    if(this.otpProcessService && this.otpProcessService.loginRespObs) {
      this.otpProcessService.loginRespObs.subscribe((response: any) => {
        if(response && response.email) {
          this.loginloaded = true;
          this.onClosePopup();
          console.log("subscribeResponse")
          if(this.loginloaded && this.router.url === '/login'){
            this.router.navigate(["/"]);
          }
        }
      })
    }
  }

  /**
   * @method getCurrentPage
   */
  public getCurrentPage(event) {
    // console.log('eventeventeventeventeventevent',event)
  }

  /**
   * removed localstorage items
   * @method removedStoredItems
   */
  public removedStoredItems() {
    localStorage.removeItem("loginNextScreen");
    localStorage.removeItem("userName");
    localStorage.removeItem("otpToken");
    localStorage.removeItem("userAccount");
    localStorage.removeItem("loginMobile");
  }

  closepopup(){
    this.onClosePopup();
  }
  
}
