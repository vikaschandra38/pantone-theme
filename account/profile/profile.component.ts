import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { CookieService } from "ngx-cookie";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import { mobile } from "@env/environment";
import { Meta, Title } from "@angular/platform-browser";
import * as regex from '@app/otp/login.constants';
import { UserAccountContainer } from '../user-container-view/user-account.component';

@Component({
  selector: "app-profile",
  templateUrl: mobile
    ? "./profile.component.mobile.html"
    : "./profile.component.html",
  styleUrls: mobile
    ? ["./profile.component.mobile.css"]
    : ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  editaccount: boolean = false;
  profileview: boolean = true;
  editProfileForm: FormGroup;

  @Input() userprofileInfo;
  @Input() loginloading;
  @Input() userprofilesubmitfailure;
  @Input() userprofilesubmitloading;
  @Input() userprofilesubmitloaded;
  fname: string;
  lname: string;
  email: string;
  gender: string;
  dob: any;
  bio: string;
  mobile: number;
  location: string;
  year: any;
  @Output() profileData: EventEmitter<any> = new EventEmitter();

  emptyprofilefields = false;
  mobilefielderror: boolean;
  countrycodes: Object;
  public editMobile: boolean = false;
  public genderOption: any[] = [
    {value: '', viewValue: 'Please select gender'},
    {value: 'Male', viewValue: 'Male'},
    {value: 'Female', viewValue: 'Female'}
  ];
  public newMobileNumberForm: FormGroup;
  public isOTPScreen: boolean = false;
  public accNotExistMgs: any = '';
  public header: any = {
    head: 'Change Mobile Number',
    para: ''
  };
  @Output() updateMobileOtpVerification: EventEmitter<any> = new EventEmitter();
  @Output() generateOTP: EventEmitter<any> = new EventEmitter();
  @ViewChild('emailMobileField', {static: false}) emailMobileField;
  @ViewChild('otpField', {static: false}) otpField;
  public otpResponse: any;
  public buttonLoading: boolean = false;
  public dateSetting: any = {
    maxDate: new Date(),
    minDate: new Date(1950, 0, 1)
  };
  public OTPLoader: boolean = false;
  public timer: any;
  public showTimer: boolean = false;
  public downloadTimer: any;
  @ViewChild("OTPFieldhide", { static: false }) OTPFieldhide;
  otp: string;
  showOtpComponent = true;
  showDropdown: boolean;

  timerId: any;
  countDownValue: any;
  showLoader = false;
  showResendOtp = false;
  OTP_TIMER = 45;


  constructor(
    private cookieservice: CookieService,
    private fb: FormBuilder,
    private http: HttpClient,
    public title: Title,
    private userContainer: UserAccountContainer,
    public cd: ChangeDetectorRef
  ) {
    this.title.setTitle('Profile | Pantone');
    this.editProfileForm = fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.minLength(0)],
      mobile: [null, Validators.required],
      gender: ["Male", Validators.required],
      bio: [null],
      country: [null],
      dob: [null]
    });
  }

  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "45px",
      height: "50px"
    }
  };
  onOtpChange(otp) {
    // console.log("form", this.loginForm.value);
    if (otp.length == 4) {
      // this.otp = otp;
      // this.newMobileNumberForm.get('OTP').value
      this.newMobileNumberForm.controls.OTP.setValue(otp); 
      this.verifyOtp(otp);
    }if (otp.length == 0) {
      this.newMobileNumberForm.get('OTP').setValue('');
    }
  }
  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }


  edit_account_details() {
    this.editaccount = true;
    this.refreshDetails();
    this.profileview = false;
  }



  refreshDetails(){
    this.fname = '';
    this.lname = '';
    this.year = '';
    this.gender = '';
  }

  cancel_account_details() {
    this.editaccount = false;
    this.profileview = true;
  }
  ngOnInit() {
    this.initializeMobileForm();
    this.subscribeResponses();
  }

  ngOnChanges() {
    if (this.userprofilesubmitloaded) {
      this.editaccount = false;
      this.profileview = true;
    }

    if (this.userprofileInfo && this.userprofileInfo.first_name) {
      this.fname = this.userprofileInfo.first_name;
    }

    if (this.userprofileInfo && this.userprofileInfo.last_name) {
      this.lname = this.userprofileInfo.last_name;
    }

    if (this.userprofileInfo.billing && this.userprofileInfo.billing.gender) {
      this.gender = this.userprofileInfo.billing.gender;
    }
    if (this.userprofileInfo && (this.userprofileInfo.DOB || (this.userprofileInfo.billing && this.userprofileInfo.billing.DOB))) {
      if(this.userprofileInfo.DOB) {
        this.dob = this.userprofileInfo.DOB;
      } else if(this.userprofileInfo.billing && this.userprofileInfo.billing.DOB) {
        this.dob = this.userprofileInfo.billing.DOB;
      }
      if(this.dob) {
        var d = new Date(this.dob);
        this.year = d.toDateString();
      }
    }
    if (this.userprofileInfo.billing && this.userprofileInfo.billing.bio) {
      this.bio = this.userprofileInfo.billing.bio;
    }
      this.mobile = this.userprofileInfo && this.userprofileInfo.phone ? this.userprofileInfo.phone : '-';
    if (this.userprofileInfo.billing && this.userprofileInfo.billing.country) {
      this.location = this.userprofileInfo.billing.country;
    }
    if (this.userprofileInfo && this.userprofileInfo.email) {
      this.email = this.userprofileInfo.email;
    }

    if (!this.userprofilesubmitloading && this.userprofileInfo.billing) {
      this.editProfileForm = this.fb.group({
        first_name: this.userprofileInfo.first_name,
        last_name: this.userprofileInfo.last_name,
        mobile: this.userprofileInfo.phone ? this.userprofileInfo.phone : '',
        bio: this.userprofileInfo.billing.bio,
        country: this.userprofileInfo.billing.country,
        dob: this.dob,
        gender: this.userprofileInfo.billing.gender
      });
    }

    if (this.userprofileInfo && !this.userprofileInfo.billing) {
      this.editProfileForm = this.fb.group({
        first_name: this.userprofileInfo.first_name,
        last_name: this.userprofileInfo.last_name,
        mobile: this.userprofileInfo.phone ? this.userprofileInfo.phone : '',
        bio: "",
        country: "",
        dob: "",
        gender: "Male"
      });
    }
  }

  editProfileFormCapturedValues() {}

  get test(){
    if(this.editProfileForm.get('first_name').value == '')
    {
    console.log('Inside the function')

      return true;
    }
    
    else
    return false;
  }

  checkProfileForm() {
    if (this.editProfileForm.status === "VALID") {
      this.emptyprofilefields = false;
      this.profileData.emit(this.editProfileForm.value);
      if (!this.userprofileInfo["billing"]) {
        this.userprofilesubmitloading = true;
      }
    }
    if (this.editProfileForm.controls.mobile.status === "INVALID") {
      this.mobilefielderror = true;
    }
    if (this.editProfileForm.status === "INVALID") {
      this.emptyprofilefields = true;
    }
  }

  clearmessages() {
    this.mobilefielderror = false;
  }

  /**
   * edit mobile number or password
   * @method editMobileOrPass
   */
  public editMobileOrPass(field: any = null) {
    console.log("dsad")
    switch (field) {
      case 'mobile':
        this.header = {
          head: 'Change Mobile Number',
          para: ''
        };
        this.newMobileNumberForm.get('newMobile').setValue('');
        this.newMobileNumberForm.get('newMobile').markAsUntouched();
        this.editMobile = true;
        this.isOTPScreen = false;
        setTimeout(() => {
          if(this.emailMobileField && this.emailMobileField.nativeElement) {
            this.emailMobileField.nativeElement.focus();
          }
        }, 0);
        break;
      // case 'password':
      //   this.editPass = true;
      //   break;
    }
    if (this.emailMobileField && this.emailMobileField.nativeElement) {
      this.emailMobileField.nativeElement.focus();
    }
  }

  /**
   * @method initializeMobileForm
   */
  public initializeMobileForm() {
    this.newMobileNumberForm = this.fb.group({
      newMobile: ['', [ Validators.required, Validators.pattern(regex.mobileRegex)]],
      OTP: ['', [Validators.minLength(4)]]
    })
  }

  /**
   * @method generateOTPForUpdateMobile
   */
  public generateOTPForUpdateMobile(isResend: boolean = false) {
    this.onConfigChange();
    this.accNotExistMgs = '';
    if(this.newMobileNumberForm.get('newMobile').invalid) { return; }
    // if(document.getElementById("showResend")) {
    //   document.getElementById("showResend").style.display = "none";
    // }
    if(!isResend) {
      this.countdown(this.OTP_TIMER);
      this.buttonLoading = true;
    }else{
      // this.OTPLoader = true;
      this.showResendOtp = false;
      this.countdown(this.OTP_TIMER);
    }
   
    this.newMobileNumberForm.get('OTP').setValue('');
    this.generateOTP.emit({reset_phone: this.newMobileNumberForm.get('newMobile').value});
  }

  /**
   * @method verifyOtp
   */
  public verifyOtp(otp) {
    if(otp) {
      this.buttonLoading = true;
      if(otp) {
        this.updateMobileOtpVerification.emit({
          otpToken: this.otpResponse.otpToken,
          otp: otp
        });
      }
    } else {
      return;
    }
  }

  /**
   * close mobile verify pop up
   * @method onClosePopup
   */
  public onClosePopup() {
    this.editMobile = false;
    this.OTPLoader = false;
    this.buttonLoading = false;
    this.accNotExistMgs = '';
  }

  /**
   * @method subscribeResponses
   */
  public subscribeResponses() {
    if(this.userContainer.otpResponse) {
      this.userContainer.otpResponse.subscribe(response => {
        this.otpResponse = response;
        if(this.otpResponse && this.otpResponse.otpToken) {
          setTimeout(() => {
            this.OTPLoader = false;
            this.newMobileNumberForm.get('OTP').markAsTouched();
            if (this.OTPFieldhide && this.OTPFieldhide.nativeElement) {
              this.OTPFieldhide.nativeElement.focus();
            }
            this.cd.detectChanges();
          }, 7000);
          this.buttonLoading = false;
          this.isOTPScreen = true;
          this.header = {
            head: 'Verify with OTP',
            para: `Sent to ${this.newMobileNumberForm.get('newMobile').value}`
          }
          if(this.emailMobileField && this.emailMobileField.nativeElement) {
            this.emailMobileField.nativeElement.focus();
          }
          this.cd.detectChanges();
          this.newMobileNumberForm.get('OTP').markAsUntouched();
        } else if (this.otpResponse && this.otpResponse.error) {
          setTimeout(() => {
            this.OTPLoader = false;
            this.newMobileNumberForm.get('OTP').markAsTouched();
            if (this.OTPFieldhide && this.OTPFieldhide.nativeElement) {
              this.OTPFieldhide.nativeElement.focus();
            }
            this.cd.detectChanges();
          }, 10000);
            this.buttonLoading = false;
            if(this.otpResponse.error.message.includes('Exists')) {
              this.accNotExistMgs = this.otpResponse.error.message;
            }
            if(this.emailMobileField && this.emailMobileField.nativeElement) {
              this.emailMobileField.nativeElement.focus();
            }
            this.cd.detectChanges();
        }
      });
    }

    if(this.userContainer.mobileUpdateResp) {
      this.userContainer.mobileUpdateResp.subscribe((response: any) => {
        if(response && response.email) {
          this.buttonLoading = false;
          this.mobile = this.userprofileInfo.phone = response.phone;
          this.editProfileForm.get('mobile').setValue(response.phone);
          if(this.otpField && this.otpField.nativeElement) {
            this.otpField.nativeElement.focus();
          }
          this.onClosePopup();
          this.cd.detectChanges();
        } else if (response && response.error) {
          this.buttonLoading = false;
          if(response.error.error && response.error.error.message.includes('Invalid')) {
            this.newMobileNumberForm.get('OTP').setErrors({invalid: true});
            this.newMobileNumberForm.get('OTP').markAsTouched();
            if(this.otpField && this.otpField.nativeElement) {
              this.otpField.nativeElement.focus();
            }
            this.cd.detectChanges();
          }
        }
      })
    }
  }

  /**
   * @method OTPTimer
   */
  public OTPTimer() {
    let timeleft = 30;
    if(document.getElementById("showTime")) {
      document.getElementById("showTime").style.display = "block";
    }
    this.downloadTimer = setInterval(function() {
      timeleft--;
      this.timer = timeleft;
      if(document.getElementById("timeStart")) {
        document.getElementById("timeStart").style.display = "none";
        document.getElementById("timer").innerHTML = this.timer;
      }
      if (timeleft <= 0) {
        clearInterval(this.downloadTimer);
        this.showTimer = false;
        this.timer = "";
        if(document.getElementById("showResend")) {
          document.getElementById("showResend").style.display = "block";
        }
        if(document.getElementById("showTime")) {
          document.getElementById("showTime").style.display = "none";
        }
        
      }
    }, 1000);
  }
  navigateTomobileScreen(){
    this.isOTPScreen = false;    
    clearInterval(this.timerId);
    this.showResendOtp = false;
  }
  showDropMenu(){
    this.showDropdown = !this.showDropdown;
  }

  countdown(remainingTime) {
    this.timerId = setInterval(() => {
      // console.log("setInterval");
      this.showLoader = false;
      if (remainingTime > 0) {
        remainingTime--;
        if (remainingTime > 10) {
          this.countDownValue = "00:" + remainingTime + "" + "";
        }
        if (remainingTime == 10) {
          this.countDownValue = "00:" + remainingTime + "" + "";
        }
        if (remainingTime < 10) {
          this.countDownValue = "00:0" + remainingTime + "" + "";
        }
      } else {
        clearTimeout(this.timerId);
        this.countDownValue = "";
        this.showResendOtp = true;
        return;
      }
    }, 1000);
  }
}
