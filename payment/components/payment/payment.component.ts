import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnDestroy
  
} from "@angular/core";
import { mobile, isDesktop } from "@env/environment";
import { FormControl, Validators } from "@angular/forms";
import { AnalyticsService } from "@app/shared/services/analytics.service";
import { CartService } from "@app/shared/services/cart.service";
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
@Component({
  selector: "app-checkout-payment",
  templateUrl: isDesktop
    ? "./payment.component.html"
    : "./payment.component.mobile.html",
  styleUrls: isDesktop
    ? ["./payment.component.css"]
    : ["./payment.component.mobile.css"]
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  paymentMethod;
  @ViewChild("form", { static: true }) form: ElementRef;

  submitted = false;
  showpayment;
  @Input() checkoutLoaded;
  @Input() checkoutLoading;
  serviceabilityStatus;
  @Input() checkoutFailure;
  @Input() cartInfo;
  @Input() pincodeDataLoading;
  payuform: any = {};
  @Output() logout: EventEmitter<any> = new EventEmitter();
  @Output() proceedToPayUPayment: EventEmitter<any> = new EventEmitter();
  @Input() pincodeDataLoaded;
  @Input() pincodeData;
  // @Input() userEmail;
  shipping_method: boolean;
  @Input() measureCheckoutSteps;
  @Input() userInfo;
  @Output() makePayment: EventEmitter<any> = new EventEmitter();
  @Input() completeOrderInfo;
  @Output() checkPincodeServiceability: EventEmitter<any> = new EventEmitter();
  @Output() onlinePaymentData: EventEmitter<any> = new EventEmitter();
  grandTotal = 0;
  currentShippingAddress: any;
  @Input() shippingmethodoptions;
  @Input() cartInfoLoading;
  @Input() cartInfoLoaded;
  addSubscription$ = new Subscription();
  messagePopup = false;
  paymentload = false;
  cart_id: any;
  constructor(
    public title: Title,
    private analyticsService: AnalyticsService,
    private router: Router,
    private service: CartService
  ) {
    this.paymentMethod = new FormControl(null, [Validators.required]);
  }

  ngOnInit() {
    this.title.setTitle("Payment | Pantone");
    this.addSubscription$.add(
      this.service.currentpincodeServiceabilityData.subscribe(data => {
        if (data == null || data == undefined) {
          this.serviceabilityStatus = data.pincodeData;
        }
      }));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("cartInfo")) {
      if (this.cartInfo && this.cartInfo.shipping) {
        this.getPincodeServiceability();
        this.toCartOnOutOfStock();
      }


    }
    if (changes.hasOwnProperty("pincodeData")) {
      this.serviceabilityStatus = this.pincodeData;
    }

    if (this.checkoutFailure) {
      // if (this.paymentMethod.value === "ONLINE") {
      // } else if (this.paymentMethod.value === "COD") {
      this.router.navigate(["ordererror"]);
      // }
    }
    this.onCreateOrderSuccess(changes);
  }
  getGrandTotal($event) {
    this.grandTotal = $event;
  }
  getPincodeServiceability() {

    const pincodeObj = {
      "deliveryType": "forward",
      drop_pincode: this.cartInfo.shipping.zip
    };
    this.checkPincodeServiceability.emit(pincodeObj);
  }

  completeCheckout() {
    this.cart_id = this.cartInfo.id;
    this.currentShippingAddress = this.cartInfo.shipping;
    if (!this.paymentMethod.valid || !this.currentShippingAddress) {
      return;
    }
    const dataCheckout = {
      first_name: this.currentShippingAddress.first_name,
      last_name: this.currentShippingAddress.last_name,
      email: this.userInfo.email,
      address2: this.currentShippingAddress.address2,
      city: this.currentShippingAddress.city,
      country: "IN",
      state: this.currentShippingAddress.state,
      zip: this.currentShippingAddress.zip,
      phone: this.currentShippingAddress.phone,
      payment_method: this.paymentMethod.value,
      shipping_method: this.shipping_method,
      cart_id: this.cart_id,
      account_id: this.cartInfo.account_id,
      userPhone:this.userInfo.phone
    };


    this.makePayment.emit(dataCheckout);
    this.cart_id = this.cartInfo.id;
    this.paymentload = true;
  }

  onCreateOrderSuccess(changes) {

    if (
      this.checkoutLoaded &&
      !this.checkoutFailure &&
      !this.checkoutLoading &&
      changes.hasOwnProperty("completeOrderInfo")
    ) {
      if (this.completeOrderInfo.hasOwnProperty('billing')) {
        const data = this.measureCheckoutSteps(
          this.completeOrderInfo.cart,
          this.completeOrderInfo.billing.method
        );
        this.analyticsService.pushToDataLayer(data);
        switch (+this.completeOrderInfo.status_code) {
          case 200:
            if (this.completeOrderInfo.billing.method === "ONLINE") {
              this.payUPayment(this.completeOrderInfo);
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
      } else {
        this.router.navigate(["ordererror"]);
      }
    }
  }

  toCartOnOutOfStock() {
    let hasStock: boolean = false;
    hasStock = this.isStockUnavailable();
    if (hasStock) {
      this.router.navigate(["/checkout/cart"]);
    }
  }

  payUPayment(data) {
    this.proceedToPayUPayment.emit(data.payment);
  }
  isStockUnavailable() {
    if (this.cartInfo) {
      let cartItems = this.cartInfo.items;
      if (cartItems && cartItems.length) {
        for (let index = 0; index < cartItems.length; index++) {
          let availableStock = cartItems[index].variant
            ? cartItems[index].variant.stock_level
            : cartItems[index].product.stock_level;
          if (availableStock <= 0 || availableStock < cartItems[index].quantity) {
            return true;
          }
        }
      }
    }
    return false;
  }
  openCloseMessagePopup(value) {
    this.messagePopup = value;
    this.router.navigate(["/checkout/cart"]);
  }
  ngOnDestroy(): void {
    this.addSubscription$.unsubscribe();

  }
}
