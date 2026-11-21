import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  PLATFORM_ID,
  Inject
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { mobile } from "@env/environment";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-cart-checkout",
  templateUrl: mobile
    ? "./cart-checkout.component.mobile.html"
    : "./cart-checkout.component.html",
  styleUrls: mobile
    ? ["./cart-checkout.component.mobile.css"]
    : ["./cart-checkout.component.css"]
})
export class CartCheckoutComponent implements OnInit, OnChanges {
  @Output() registerUserEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkemailregistered: EventEmitter<any> = new EventEmitter();
  isnotemail = false;
  registerForm: FormGroup;
  @Output() socialsignupdata: EventEmitter<any> = new EventEmitter();
  @Input() socialLoading;
  @Input() socialLoaded;
  @Input() socialloginfailed;
  sociallogineerror: boolean;
  @Output() cartCloseEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    //private socialAuthService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    this.registerForm = fb.group({
      global_email: [
        null,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]
      ]
    });
  }

  ngOnInit() {}

  ngOnChanges() {
    //console.log(this.socialLoading);
    //console.log(this.socialLoaded);
    //console.log(this.socialloginfailed);
    if (this.socialloginfailed) {
      this.sociallogineerror = true;
      setTimeout(() => {
        this.sociallogineerror = false;
      }, 2000);
    }
    if (this.socialLoaded) {
      this.cartCloseEvent.emit();
      console.log('gtm issue');
      this.router.navigate(["checkout/cart"]);
    }
  }

  ChangeInavlid() {
    this.isnotemail = false;
  }
  registerUserEmit() {
    if (this.registerForm.status === "VALID") {
      this.isnotemail = false;
      this.registerUserEvent.emit();
      this.checkemailregistered.emit(this.registerForm.value.global_email);
    } else {
      this.isnotemail = true;
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
  //       //console.log(socialPlatform + " sign in data : ", userData);
  //       //console.log(userData.email);
  //       // Now sign-in with userData

  //       this.socialsignupdata.emit(userData);
  //     });
  //   }
  // }
}
