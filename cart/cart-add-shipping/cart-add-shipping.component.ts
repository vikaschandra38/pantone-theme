import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef
} from "@angular/core";
import { Cart } from "@app/cart/models/cart.model";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { mobile } from "@env/environment";
import { Subscription } from "rxjs";
import { PATTERNS, VALIDATION_MESSAGES } from "@app/_constants/constants";
import { Store } from "@ngrx/store";
import * as user from "@app/user/actions/user.actions";

import * as fromUser from "@app/user/reducers";
import { UserService } from "@app/shared/services/user.service";
import { AnalyticsService } from "@app/shared/services/analytics.service";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "app-cart-add-shipping",
  templateUrl: mobile
    ? "./cart-add-shipping.component.mobile.html"
    : "./cart-add-shipping.component.html",
  styleUrls: mobile
    ? ["./cart-add-shipping.component.mobile.css"]
    : ["./cart-add-shipping.component.css"]
})
export class CartAddShippingComponent implements OnInit, OnChanges, OnDestroy {
  @Output() shippingDetails: EventEmitter<any> = new EventEmitter();
  @Output() doCheckout: EventEmitter<any> = new EventEmitter();
  @Output() changeCheckoutLoading: EventEmitter<any> = new EventEmitter();
  @Input() cartinfo;
  @Input() userInformation;
  @Input() shippingloaded;
  @Input() shippingloading;
  @Input() completeOrderInfo;
  @Input() shippingupdatefailure;
  @Input() checkoutfailure;
  @Input() checkoutloaded;
  @Input() checkoutloading;
  @Input() countries;
  @Input() alladdress;
  @Input() useraddressloading;
  @Input() useraddressloaded;
  @Input() shippingmethodoptions;
  shippingForm: FormGroup;
  shippingmethod: FormGroup;
  shippingerrormessage = false;
  showpayment: boolean = false;
  showaddres: boolean = true;
  emailuser: any;
  shippingaddresss: boolean = true;
  paymentmethod: boolean = false;
  showMobileError: boolean = false;
  emptyaddrss: boolean = false;
  ordersummery: any;
  savedaddress: boolean;
  editpopup: boolean;
  addressForm: FormGroup;
  editindex: any;
  emptyaddressfields: boolean = false;
  weekends: boolean;
  showshippingmethod = false;
  getPincodeServicebilityData: any;
  isShowAddress: boolean = false;
  @Output() editAddressData: EventEmitter<any> = new EventEmitter();
  @Output() onlinePaymentData: EventEmitter<any> = new EventEmitter();
  @Input() usereditaddresssaveloading;
  @Input() usereditaddresssaveloaded;
  @Input() usereditaddresssavefailure;
  @Input() pincodeData;
  @Input() pincodeDataLoading;
  @Input() pincodeDataLoaded;
  @Input() useraddresssaveloading;
  @Input() useraddresssaveloaded;
  @Input() useraddresssavefailure;
  @Input() useraddressnullloading;
  @Input() useraddressnullloaded;
  @Input() useraddressnullfailure;
  @Input() useraddressremoveloading;
  @Input() useraddressremoveloaded;
  @Input() useraddressremovefailure;
  showPincodeError = "false";
  pincodeErrorMessage = "";
  pincodeDetails;
  save_new_address: boolean;
  show_edit_button: boolean;

  @Output() addressAdd: EventEmitter<any> = new EventEmitter();
  @Output() addressAddShipping: EventEmitter<any> = new EventEmitter();

  newAddressArray: any[];
  @Output() removedAddressData: EventEmitter<any> = new EventEmitter();
  @Output() getAddressByPincodeData: EventEmitter<any> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();
  saveType: string;
  submitted = false;
  shippingAddressId;
  // showAllAdrresses = [];
  shippingNewAddress: any;
  shippingoptions: any;
  activatebtn: boolean;
  buttonmsg: boolean;
  shipping_method: boolean;
  cart_id: any;
  validationMessages = VALIDATION_MESSAGES;
  subscriptions$ = new Subscription();
  paymentMethod = new FormControl(null, [Validators.required]);
  messagePopup = false;
  pincodefielderror: boolean;
  isCod: boolean;
  constructor(
    private store: Store<any>,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    public title: Title,
    private cdRef: ChangeDetectorRef
  ) {
    this.emailuser = this.cookieService.get("loginuser");
    // this.createShippingForm();
    //this.createAddEditAddressForm();
    this.title.setTitle("Checkout | Pantone");
  }

  ngOnInit() {
    // this.getAddressByPincode();
  }

  toCartOnOutOfStock() {
    if (this.isStockUnavailable()) {
      this.router.navigate(["/cart"]);
    }
  }

  isStockUnavailable() {
    if (this.cartinfo) {
      let cartItems = this.cartinfo.items;
      for (let index = 0; index < cartItems.length; index++) {
        let availableStock = cartItems[index].variant
          ? cartItems[index].variant.stock_level
          : cartItems[index].product.stock_level;
        if (availableStock <= 0 || availableStock < cartItems[index].quantity) {
          return true;
        }
      }
    }
    return false;
  }

  createShippingForm() {
    this.submitted = false;
    this.shippingForm = this.fb.group({
      name: ["", Validators.required],
      last_name: [""],
      mobile: ["", [Validators.required, Validators.pattern(PATTERNS.PHONE)]],
      pincode: [
        null,
        [Validators.required, Validators.pattern(PATTERNS.PINCODE)]
      ],
      state: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      address_type: ["1", [Validators.required]],

      sat_open: [""],
      sun_open: [""],
      add_id: [new Date().toISOString()],
      email: [{ value: this.emailuser, disabled: true }]
    });
  }

  createAddEditAddressForm() {
    this.addressForm = this.fb.group({
      name: ["", Validators.required],
      last_name: [""],
      mobile: [
        "",
        [
          Validators.minLength(10),
          Validators.required,
          Validators.pattern(PATTERNS.PHONE)
        ]
      ],
      pincode: [
        null,
        [Validators.required, Validators.pattern(PATTERNS.PINCODE)]
      ],
      state: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      address_type: ["1", [Validators.required]],
      sat_open: [""],
      sun_open: [""],
      add_id: [new Date().toISOString()]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty("cartinfo")) {
      this.toCartOnOutOfStock();
    }

    if (
      changes.hasOwnProperty("shippingloaded") ||
      changes.hasOwnProperty("checkoutloading")
    ) {
      if (
        this.shippingloaded &&
        !this.checkoutloading &&
        this.showPincodeError == "false"
      ) {
        this.shippingaddresss = false;
        this.showpayment = true;
        this.submitted = false;
        this.showaddres = false;
      }
    }

    // if (this.alladdress && this.alladdress.length > 0) {
    //   this.showAllAdrresses = [];
    //   if (this.alladdress.length > 2) {
    //     for (let i = 0; i < 2; i++) {
    //       this.showAllAdrresses.push(this.alladdress[i]);
    //     }
    //   }
    //   else {
    //     this.showAllAdrresses = this.alladdress;
    //   }

    //   if (this.isShowAddress) {
    //     this.showAllAdrresses = this.alladdress;
    //   }
    // }

    this.shippingoptions = this.shippingmethodoptions.services;

    if (this.checkoutfailure) {
      // if (this.paymentMethod.value === "ONLINE") {
      // } else if (this.paymentMethod.value === "COD") {
      this.router.navigate(["ordererror"]);
      // }
    }
    this.onCreateOrderSuccess(changes);

    if (
      this.usereditaddresssaveloaded &&
      changes.hasOwnProperty("usereditaddresssaveloaded")
    ) {
      this.editpopup = false;
      this.submitted = false;
      if (this.alladdress.length > 0) {
        this.emptyaddrss = false;
        this.savedaddress = true;
      } else {
        this.emptyaddrss = true;
        this.savedaddress = false;
      }
    }

    if (this.useraddresssaveloaded) {
      this.editpopup = false;
    }

    if (
      changes.hasOwnProperty("useraddresssaveloaded") &&
      this.useraddresssaveloaded &&
      this.alladdress.length === 1
    ) {
      this.shippingAddressId = this.alladdress[0].add_id;
      this.emptyaddrss = false;
      this.showpayment = true;
      this.continueShipping();
    }

    if (this.useraddressnullloading || this.useraddressremoveloading) {
      this.emptyaddrss = false;
      this.savedaddress = false;
    }

    if (
      this.useraddressremoveloaded &&
      changes.hasOwnProperty("useraddressremoveloaded")
    ) {
      this.showpayment = false;
      if (this.alladdress && this.alladdress.length > 0) {
        this.emptyaddrss = false;
        this.savedaddress = true;
      } else {
        this.emptyaddrss = true;
        this.savedaddress = false;
        this.submitted = false;
      }
    }

    if (this.useraddressloaded && changes.hasOwnProperty("useraddressloaded")) {
      if (this.alladdress && this.alladdress.length > 0) {
        this.emptyaddrss = false;
        this.savedaddress = true;
      } else {
        this.emptyaddrss = true;
        this.savedaddress = false;
      }
    }
    if (
      !this.shippingAddressId &&
      this.alladdress &&
      this.alladdress[0] &&
      this.alladdress[0].add_id
    ) {
      this.shippingAddressId = this.alladdress[0].add_id;
    }
  }

  // updatePincodeStoreDetail() {
  //   this.store.select(fromUser.pincodeServiceability).subscribe((pincodeData) => {
  //     this.pincodeDetails = pincodeData;
  //   });
  // }

  onCreateOrderSuccess(changes) {
    if (
      this.checkoutloaded &&
      !this.checkoutfailure &&
      !this.checkoutloading &&
      changes.hasOwnProperty("completeOrderInfo")
    ) {
      switch (+this.completeOrderInfo.status_code) {
        case 200:
          if (this.completeOrderInfo.billing.method === "ONLINE") {
            this.proceedToPayUPayment(this.completeOrderInfo);
          } else if (this.completeOrderInfo.billing.method === "COD") {
            this.router.navigate([
              "ordersuccess",
              this.completeOrderInfo.order.id
            ]);
          }
          break;

        case 300:
          /** Logout user and on successful logout redirect to cart page */
          this.logout.emit();
          break;

        case 400:
          this.router.navigate(["ordererror"]);
          break;
        case 500:
          /** show out of stock popup and redirect to cart on revise order */
          this.messagePopup = true;
          break;
        default:
          break;
      }
    }
  }

  captureShippingDetails() {
    this.submitted = true;
    if (!this.shippingForm.valid) {
      return;
    }
    this.submitted = false;
    this.shippingForm.value.add_id = new Date().toISOString();
    let add_data_shipping = this.shippingForm.getRawValue();
    this.addressAddShipping.emit(add_data_shipping);
  }

  // completeCheckout() {
  //   this.cart_id = this.cartinfo.id;
  //   this.submitted = true;
  //   if (!this.paymentMethod.valid || !this.shippingNewAddress) {
  //     return;
  //   }
  //   this.submitted = false;
  //   var dataCheckout = {
  //     first_name: this.shippingNewAddress.name,
  //     last_name: this.shippingNewAddress.last_name,
  //     email: this.emailuser,
  //     address2: this.shippingNewAddress.address,
  //     city: this.shippingNewAddress.city,
  //     country: "IN",
  //     state: this.shippingNewAddress.state,
  //     zip: this.shippingNewAddress.pincode,
  //     phone: this.shippingNewAddress.mobile,
  //     payment_method: this.paymentMethod.value,
  //     shipping_method: this.shipping_method,
  //     cart_id: this.cart_id,
  //     account_id: this.userInformation.id
  //   };
  //   this.measureCheckoutSteps();
  //   this.doCheckout.emit(dataCheckout);
  //   this.cart_id = this.cartinfo.id;

  // }
  makePayment($event) {
    this.doCheckout.emit($event);
  }
  showdetails(event) {
    const el = event.currentTarget;
    el.classList.toggle("arrowtick");
    if (el.nextSibling.style.display === "block") {
      el.nextSibling.style.display = "none";
    } else {
      el.nextSibling.style.display = "block";
    }
  }

  keyPress(event: any) {
    var a = event.target.value;
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.shippingerrormessage = false;
    this.shippingaddresss = false;
    this.showpayment = false;
    this.showaddres = false;
    this.shippingloaded = false;
    this.shippingloading = false;
    this.shippingupdatefailure = false;
    this.checkoutfailure = false;
    this.checkoutloaded = false;
    this.checkoutloading = false;
    this.showPincodeError = "false";
    this.pincodeErrorMessage = "";
    this.subscriptions$.unsubscribe();
  }

  addnewaddress() {
    this.saveType = "Add a New Address";
    this.save_new_address = true;
    this.show_edit_button = false;
    this.addressForm.reset();
    this.submitted = false;
    this.addressForm.patchValue({
      address_type: "1"
    });
    this.editpopup = true;
  }

  editaddressclick(address_id) {
    this.saveType = "Edit Address";
    this.save_new_address = false;
    this.show_edit_button = true;
    this.editpopup = true;

    var b = this.alladdress.filter((address, index) => {
      if (address.add_id === address_id) {
        this.editindex = index;
      }
      return address.add_id === address_id;
    });
    this.addressForm.patchValue(b[0]);
  }

  closeeditaddress() {
    this.editpopup = false;

    if (this.alladdress.length > 0) {
      this.emptyaddrss = false;
      this.savedaddress = true;
    } else {
      this.emptyaddrss = true;
      this.savedaddress = false;
    }
    this.addressForm.reset();
    this.shippingForm.reset();
    this.shippingForm.get("address_type").patchValue("1");
    this.addressForm.get("address_type").patchValue("1");

    this.pincodefielderror = false;
    this.submitted = false;
  }

  saveEditAddress() {
    this.submitted = true;
    if (!this.addressForm.valid) {
      return;
    }
    this.submitted = false;
    this.alladdress[this.editindex] = this.addressForm.value;
    this.editAddressData.emit(this.alladdress);
  }

  home() {
    this.weekends = false;
  }
  office() {
    this.weekends = true;
  }

  saveAddress() {
    this.submitted = true;
    if (!this.addressForm.valid) {
      return;
    }
    this.addressForm.value.add_id = new Date().toISOString();
    var add_data = this.addressForm.getRawValue();
    this.addressAdd.emit(add_data);
  }

  remove(address_id) {
    if (this.shippingAddressId == address_id) {
      this.shippingAddressId = "";
    }

    this.newAddressArray = this.alladdress.filter(
      address => address.add_id !== address_id
    );
    this.removedAddressData.emit(this.newAddressArray);
  }
  removeAddress($event) {
    this.removedAddressData.emit($event);
  }

  proceedToPayUPayment(cartInfo) {
    this.onlinePaymentData.emit(cartInfo.payment);
  }

  continueShipping() {
    this.submitted = true;
    if (!this.shippingAddressId) {
      return;
    }

    this.shippingNewAddress = this.alladdress.find(
      address => address.add_id === this.shippingAddressId
    );
    var dataCheckout = {
      first_name: this.shippingNewAddress.name,
      last_name: this.shippingNewAddress.last_name,
      email: this.emailuser,
      address2: this.shippingNewAddress.address,
      city: this.shippingNewAddress.city,
      country: "IN",
      state: this.shippingNewAddress.state,
      zip: this.shippingNewAddress.pincode,
      phone: this.shippingNewAddress.mobile
    };

    // this.isPincodeServiceable(dataCheckout);
  }

  onSelectShipping(event) {
    this.activatebtn = true;
    this.shipping_method = event.value;
    this.buttonmsg = false;
  }

  proceedToPayment() {
    this.shippingaddresss = false;
    this.showpayment = true;
    this.showshippingmethod = false;
    this.showaddres = false;
  }

  isPincodeServiceable(dataCheckout) {
    this.showPincodeError = "false";
    this.pincodeErrorMessage = null;
    this.cdRef.detectChanges();

    const pincodeObj = {
      "deliveryType": "forward",
      drop_pincode: dataCheckout.zip
    };

    this.store.dispatch(new user.CheckPincode(pincodeObj));
    this.subscriptions$.add(
      this.store
        .select(fromUser.pincodeServiceabilityLoaded)
        .subscribe(data => {
          let isValid = false;

          if (data) {
            this.getPincodeServicebilityData = this.store
              .select(fromUser.pincodeServiceability)
              .subscribe(pincodeData => {
                if (pincodeData) {
                  this.pincodeDetails = pincodeData;
                  if (!this.pincodeDetails["isServiceable"]) {
                    isValid = false;
                    this.showPincodeError = "true";
                    this.pincodeErrorMessage = "Pincode Not serviceable";
                  } else {
                    isValid = true;
                  }
                  if (isValid) {
                    this.shippingDetails.emit(dataCheckout);
                  }
                } else {
                  isValid = false;
                  this.showPincodeError = "true";
                  this.pincodeErrorMessage = "Invalid Pincode";
                  this.pincodeDetails = null;
                }
                this.cdRef.detectChanges();
              });
          }
          //  else {
          //   isValid = false;
          //   this.showPincodeError = true;
          //   this.pincodeErrorMessage = 'Invalid Pincode';
          //   this.pincodeDetails = null;
          // }
        })
    );
  }
  // showmsg() {
  //   this.buttonmsg = true;
  // }

  showHideAddress() {
    this.showaddres = !this.showaddres;
    this.showpayment = false;
    if (this.alladdress.length > 0) {
      this.savedaddress = this.showaddres;
    } else {
      this.emptyaddrss = this.showaddres;
    }
  }
  openCloseMessagePopup(value) {
    this.messagePopup = value;
    this.router.navigate(["/cart"]);
  }

  measureCheckoutSteps() {
    let products = [];
    products = this.cartinfo.items.map(product => {
      return {
        name: product.product.name,
        id: product.product_id,
        price: product.price,
        brand: product.product["attributes"].brand
          ? product.product["attributes"].brand
          : "BlackBerry",
        category: product.product["attributes"].category,
        variant: product.product["attributes"].colour,
        quantity: product.quantity
      };
    });
    const data = {
      event: "checkout",
      ecommerce: {
        checkout: {
          actionField: { step: 1, option: "Address Selected" },
          products: products
        }
      }
    };
    this.analyticsService.pushToDataLayer(data);
  }
  // all addresses show more or show less function
  // showMoreAddress() {
  //   this.isShowAddress = true;
  //   this.showAllAdrresses = this.alladdress;
  // }
  // showLessAddress() {
  //   this.isShowAddress = false;

  //   this.showAllAdrresses = [];
  //   if (this.alladdress.length > 2) {
  //     for (let i = 0; i < 2; i++) {
  //       this.showAllAdrresses.push(this.alladdress[i]);
  //     }
  //   }
  // }
  saveShippingAddress($event) {
    this.addressAdd.emit($event);
  }
  editAddress($event) {
    this.editAddressData.emit($event);
  }
  saveShippingDetails($event) {
    this.shippingDetails.emit($event);
  }
}
