import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  Output
} from "@angular/core";
import { mobile, isDesktop } from "@env/environment";
import { CartService } from "@app/shared/services/cart.service";
import { ERROR_MESSAGES } from "@app/_constants/constants";
import { Router, ActivatedRoute } from "@angular/router";
import { AnalyticsService } from "../../../../../shared/services/analytics.service";
import { Title } from "@angular/platform-browser";
@Component({
  selector: "app-checkout-address",
  templateUrl: isDesktop
    ? "./checkout-address.component.html"
    : "./checkout-address.component.mobile.html",
  styleUrls: isDesktop
    ? ["./checkout-address.component.css"]
    : ["./checkout-address.component.mobile.css"]
})
export class CheckoutAddressComponent implements OnInit, OnChanges {
  @Input() userInformation;
  @Input() cartInfo;
  @Input() userInfoLoading;
  @Input() userInfoLoaded;
  @Input() shippingLoading;
  @Input() shippingLoaded;
  @Input() shippingUpdateFailure;
  @Input() userAddressSaveLoading;
  @Input() userAddressSaveLoaded;
  @Input() userAddressSaveFailure;
  @Input() userAddressRemoveLoading;
  @Input() userEditAddressSaveLoading;
  @Input() userEditAddressSaveLoaded;
  @Input() userEditAddressSaveFailure;
  @Output() updateCartAddress: EventEmitter<any> = new EventEmitter();
  @Output() saveAddress: EventEmitter<any> = new EventEmitter();
  @Output() editAddressData: EventEmitter<any> = new EventEmitter();
  @Output() removedAddressData: EventEmitter<any> = new EventEmitter();
  @Output() checkPincodeServiceability: EventEmitter<any> = new EventEmitter();
  @Input() cartInfoLoading;
  @Input() cartInfoLoaded;
  @Output() saveShipping: EventEmitter<any> = new EventEmitter();
  @Input() measureCheckoutSteps;
  @Input() pincodeDataLoading;
  @Input() pincodeDataLoaded;
  @Input() pincodeData;

  addressList: any[];
  openAddressForm: boolean;
  formType;
  editData: any;
  message = ERROR_MESSAGES;
  ADD_ADDRESS_ROUTE = "/checkout/address/add";
  LIST_ADDRESS_ROUTE = "/checkout/address/list";

  constructor(
    public title: Title,
    private cartService: CartService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    
    this.title.setTitle("Address | Pantone");
  }
  ngOnChanges(changes: SimpleChanges) {    
    if (
      changes.hasOwnProperty("pincodeData") &&
      changes.pincodeData.currentValue !== null
    ) {
      if (changes.pincodeData) {
        this.handlePincodeData(changes.pincodeData.currentValue);
      }
    }
    if (changes.hasOwnProperty("userInformation")) {
      if (this.userInformation && this.userInformation.billing) {
        this.addressList = this.userInformation.billing && this.userInformation.billing.addresses ? this.userInformation.billing.addresses : null;
        if (this.addressList && this.addressList.length) {
          this.showAddressForm(false);
        } else {
          this.showAddressForm(true);
        } 
      } else if(this.userInformation && (this.userInformation.billing == null || this.userInformation.billing == {})) {
        this.showAddressForm(true);
      }
    }

    if (
      changes.hasOwnProperty("userAddressSaveLoaded") ||
      changes.hasOwnProperty("userEditAddressSaveLoaded")
    ) {
      if (this.userAddressSaveLoaded || this.userEditAddressSaveLoaded) {
        this.showAddressForm(false);
      }
    }
  }
  handlePincodeData(pincodeData) {
    let pincodeObj;
    if (pincodeData && pincodeData.isServiceable && pincodeData.isCod === "1") {
      pincodeObj = {
        pincodeData,
        error: false,
        pincodeErrorMsg: this.message.COD_AVAILABLE,
        pincodeButtonErrorMsg: null
      };
    } else if (pincodeData && !pincodeData.isServiceable) {
      pincodeObj = {
        pincodeData,
        error: true,
        pincodeErrorMsg: this.message.SERVICEABILITY_ERROR,
        pincodeButtonErrorMsg: this.message.SERVICEABILITY_BUTTON_ERROR
      };
    } else if (
      pincodeData &&
      pincodeData.isServiceable &&
      pincodeData.isCod === "0"
    ) {
      pincodeObj = {
        pincodeData,
        error: false,
        pincodeErrorMsg: this.message.COD_NOT_AVAILABLE,
        pincodeButtonErrorMsg: null
      };
    } else {
      pincodeObj = {
        pincodeData,
        error: true,
        pincodeErrorMsg: this.message.INVALID_PINCODE,
        pincodeButtonErrorMsg: this.message.INVALID_PINCODE
      };
    }
    this.cartService.changePincodeServiceablityData(pincodeObj);
  }
  saveShippingAddress($event) {
    this.saveAddress.emit($event);
  }
  editAddress($event) {
    this.editAddressData.emit($event);
  }
  updatingCartAddress($event) {
    this.updateCartAddress.emit($event);
  }

  checkFormType($event) {
    this.formType = $event;
  }
  showAddressForm($event) {
    this.openAddressForm = $event;
    // if (this.openAddressForm === true) {
    //  // this.router.navigate(['/checkout/address/add']);
    // } else {
    //   this.router.navigate(['/checkout/address/list']);

    // }
  }
  getEditAddressData(event) {
    this.editData = event;
  }
  removeAddress($event) {
    this.removedAddressData.emit($event);
  }

  continueShipping(event) {
    this.saveShipping.emit(event);
    const data = this.measureCheckoutSteps(this.cartInfo);
    this.analyticsService.pushToDataLayer(data);
  }

  isPincodeServiceable(data) {
    if (data) {
      const pincodeObj = {
        "deliveryType": "forward",
        drop_pincode: data.pincode
      };

      this.checkPincodeServiceability.emit(pincodeObj);
    }
  }

  ngOnDestroy(): void {
    this.shippingUpdateFailure = false;
  }
}
