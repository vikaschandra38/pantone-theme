import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  Input,
  SimpleChanges
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { mobile } from "@env/environment";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-cart-checkout-register",
  templateUrl: mobile
    ? "./cart-checkout-register.component.mobile.html"
    : "./cart-checkout-register.component.html",
  styleUrls: mobile
    ? ["./cart-checkout-register.component.mobile.css"]
    : ["./cart-checkout-register.component.css"]
})
export class CartCheckoutRegisterComponent implements OnInit, OnChanges {
  rForm: FormGroup;
  rlForm: FormGroup;
  loggedin;
  emai = "nbmjnbmn";
  @Output() registerUserData: EventEmitter<any> = new EventEmitter();
  @Output() loginData: EventEmitter<any> = new EventEmitter();
  @Input() emailStats;
  @Input() verifyemail;
  @Input() loginloading;
  @Input() loginloaded;
  @Input() loginloaded2;
  @Input() loginfailed;
  @Input() signupinitiating;
  @Input() signupsuccess;
  @Input() signupsuccess2;
  @Input() signupfailure;
  @Output() registerloginClose: EventEmitter<any> = new EventEmitter();
  @Output() changepopupcontent: EventEmitter<any> = new EventEmitter();
  @Output() showloginpop: EventEmitter<any> = new EventEmitter();
  @Output() opencartinitial: EventEmitter<any> = new EventEmitter();
  @Output() forgetpasswordcartpopup: EventEmitter<any> = new EventEmitter();
  openlogin: boolean;
  openregister: boolean;
  emailinvalid: boolean = false;
  loginpasswordinvalid: boolean = false;
  signupemailinvalid: boolean;
  signuppasswordinvalid: boolean;
  signupFirstinvalid: boolean;
  password: any;
  fname: any;
  signuppass: any;
  lname: any;
  show: boolean = true;
  hid: boolean = false;
  addSubscription$ = new Subscription();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cookieservice: CookieService
  ) {
    this.rForm = fb.group({
      first_name: [this.fname, [Validators.required, Validators.minLength(3)]],
      last_name: [this.lname, Validators.minLength(3)],
      signupemail: [
        this.verifyemail,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]
      ],
      signuppassword: [
        this.signuppass,
        [Validators.required, Validators.minLength(1)]
      ]
    });

    this.rlForm = fb.group({
      loginemail: [
        this.verifyemail,
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
      ],
      loginpassword: [this.password, Validators.minLength(7)]
    });
    this.loggedin = this.cookieservice.get("loginuser");
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

  ngOnInit() {
    //console.log('why here');
    if (this.loginloaded2) {
      //console.log(this.loginloaded2);
      this.addSubscription$.add(
        this.loginloaded2.subscribe(data => {
          //console.log(data);

          if (data) {
            //console.log('gtm issue');
            this.changepopupcontent.emit();

            this.registerloginClose.emit();
            this.router.navigate(["checkout/cart"]);
          }
        }));
    }
    if (this.signupsuccess2) {
      this.changepopupcontent.emit();
      this.addSubscription$.add(
        this.signupsuccess2.subscribe(data => {
          if (data) {
            //console.log('gtm issue');

            this.registerloginClose.emit();
            this.router.navigate(["checkout/cart"]);
          }
        }));
    }
  }
  routeToFunc() {
    this.changepopupcontent.emit();
    //console.log('gtm issue');
    this.router.navigate(["checkout/cart"]);
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    this.loggedin = this.cookieservice.get("loginuser");
    this.rForm = this.fb.group({
      first_name: [this.fname, [Validators.required, Validators.minLength(3)]],
      last_name: [this.lname],
      signupemail: [
        this.verifyemail,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]
      ],
      signuppassword: [
        this.signuppass,
        [Validators.required, Validators.minLength(7)]
      ]
    });

    this.rlForm = this.fb.group({
      loginemail: [
        this.verifyemail,
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
      ],
      loginpassword: [this.password, Validators.minLength(7)]
    });
    this.loggedin = this.cookieservice.get("loginuser");
    if (this.signupsuccess) {
      this.emailStats = -1;
      this.opencartinitial.emit();
      //console.log('gtm issue');
      this.router.navigate(["checkout/cart"]);
      this.registerloginClose.emit();
    }
  }

  addPost(arg) {
    //console.log(this.rForm);
    this.verifyemail = arg.signupemail;
    this.fname = arg.first_name;
    this.lname = arg.last_name;
    this.signuppass = arg.signuppassword;

    if (this.rForm.controls.signupemail.invalid) {
      // console.log("signupemailinvalid");
      this.signupemailinvalid = true;
    }
    if (this.rForm.controls.first_name.invalid) {
      // console.log("signupFirstinvalid");
      this.signupFirstinvalid = true;
    }
    if (this.rForm.controls.signuppassword.invalid) {
      //console.log("signuppasswordinvalid");
      this.signuppasswordinvalid = true;
    }
    if (this.rForm.valid) {
      //console.log(this.rForm);
      //console.log("registerUserData Emitted");
      this.registerUserData.emit(arg);
    }
  }
  clearmessages() {
    this.loginpasswordinvalid = false;
    this.emailinvalid = false;
    this.signupemailinvalid = false;
    this.signupFirstinvalid = false;
    this.signuppasswordinvalid = false;
    this.loginfailed = false;
  }
  login(arg) {
    this.verifyemail = arg.loginemail;
    this.password = arg.loginpassword;
    if (this.rlForm.controls.loginemail.invalid) {
      this.emailinvalid = true;
    }
    if (this.rlForm.controls.loginpassword.invalid) {
      this.loginpasswordinvalid = true;
    }
    if (this.rlForm.valid) {
      this.loginData.emit(arg);
    }
  }
  openloginagain() {
    this.openlogin = true;
    this.emailStats = -1;
  }

  forgetpasswordcart() {
    this.forgetpasswordcartpopup.emit(true);
  }
  opencreateaccountagain() {
    this.openlogin = false;
    this.emailStats = 0;
  }
  ngOnDestroy(): void {
    console.log('gtm issue destroyed');
    this.addSubscription$.unsubscribe();
  }
}
