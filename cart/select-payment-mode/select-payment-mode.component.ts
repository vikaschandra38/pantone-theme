import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { mobile } from "@env/environment";
import { FormControl, Validators } from "@angular/forms";
import { AnalyticsService } from "@app/shared/services/analytics.service";
import { CartService } from "@app/shared/services/cart.service";

@Component({
  selector: "app-select-payment-mode",
  templateUrl: mobile
    ? "./select-payment-mode.component.mobile.html"
    : "./select-payment-mode.component.html",
  styleUrls: [
    mobile
      ? "./select-payment-mode.component.mobile.css"
      : "./select-payment-mode.component.css"
  ]
})
export class SelectPaymentModeComponent implements OnInit {
  paymentMethod = new FormControl(null, [Validators.required]);
  submitted = false;
  showpayment;
  @Input() checkoutloaded;
  @Input() checkoutloading;
  @Input() cartinfo;
  @Input() userEmail;
  shipping_method: boolean;
  @Input() userInformation;
  @Output() makePayment: EventEmitter<any> = new EventEmitter();
  currentShippingAddress: any;
  cart_id: any;
  constructor(
    private analyticsService: AnalyticsService,
    private service: CartService
  ) {}

  ngOnInit() {
    this.service.currentShippingAddress.subscribe(
      address => (this.currentShippingAddress = address)
    );
  }

  completeCheckout() {
    this.cart_id = this.cartinfo.id;
    
    if (!this.paymentMethod.valid || !this.currentShippingAddress) {
      return;
    }
    this.submitted = false;
    const dataCheckout = {
      first_name: this.currentShippingAddress.name,
      last_name: this.currentShippingAddress.last_name,
      email: this.userEmail,
      address2: this.currentShippingAddress.address,
      city: this.currentShippingAddress.city,
      country: "IN",
      state: this.currentShippingAddress.state,
      zip: this.currentShippingAddress.pincode,
      phone: this.currentShippingAddress.mobile,
      payment_method: this.paymentMethod.value,
      shipping_method: this.shipping_method,
      cart_id: this.cart_id,
      account_id: this.userInformation.account_id
    };
    
    this.makePayment.emit(dataCheckout);
    this.cart_id = this.cartinfo.id;
  }
}
