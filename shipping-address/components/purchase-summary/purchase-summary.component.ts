import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CartService } from '@app/shared/services/cart.service';
import { Router } from '@angular/router';
import { mobile, isDesktop } from "@env/environment";

@Component({
  selector: 'app-purchase-summary',
  templateUrl: isDesktop
    ? './purchase-summary.component.html'
    : './purchase-summary.component.mobile.html',
  styleUrls: isDesktop
    ? ['./purchase-summary.component.css']
    : ['./purchase-summary.component.mobile.css'] 
})
export class PurchaseSummaryComponent implements OnInit {
  @Input() cartInfo;
  @Input() userInfo;
  viewdetails = true;
  hidedetails = false;
  bagdetails = false;
  currentShippingAddress;
  currentSelectedAddress;
  mobile = mobile;
  serviceabilityStatus;
  @Input() shippingLoading;
  @Input() shippingLoaded;
  @Input() openAddressForm;
  @Output() addressSelected: EventEmitter<any> = new EventEmitter();
  @Output() shippingDetails: EventEmitter<any> = new EventEmitter();
  @Output() grandTotalDetail: EventEmitter<any> = new EventEmitter();

  PAYMENT_ROUTE = '/checkout/payment';
  ADDRESS_ROUTE = '/checkout/address';
  totalBagDiscount = 0;
  grandTotal = 0;
  actualBagTotal = 0;
  shippingAddressId = new FormControl(null, [Validators.required]);
  constructor(private service: CartService, public router: Router) {

    this.service.currentpincodeServiceabilityData.subscribe(pincodeData => {
      this.serviceabilityStatus = pincodeData;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.service.currentShippingAddress.subscribe(address => {
      if (address && this.router.url === this.ADDRESS_ROUTE) {
        this.currentSelectedAddress = address;
      }

    });
    if (this.router.url === this.PAYMENT_ROUTE) {
      this.currentSelectedAddress = this.cartInfo.shipping;

    }
    if (changes.hasOwnProperty('cartInfo')) {

      this.getBagDiscount();

    }
  }

  getBagDiscount() {
    this.totalBagDiscount = 0;
    this.actualBagTotal = 0;
    if (this.cartInfo && this.cartInfo.items) {
      this.actualBagTotal = this.cartInfo.items.reduce(function (acc, obj) {
        if(obj.variant === null){
          return acc + (obj.product.price) * obj.quantity;
        }else{
          return acc + (obj.variant.price) * obj.quantity;
        }

      }, 0);

      this.totalBagDiscount = this.cartInfo.items.reduce(function (acc, obj) {
        if(obj.variant === null){
          if (obj.product.price !== obj.product.sale_price) {
            return acc + (obj.product.price - obj.product.sale_price) * obj.quantity;
          }
          else {
            return acc || 0;
          }
        }else{
          if (obj.variant.price !== obj.variant.sale_price) {
            return acc + (obj.variant.price - obj.variant.sale_price) * obj.quantity;
          }
          else {
            return acc || 0;
          }
        }

        
      }, 0);
      if (this.totalBagDiscount > 0) {
        this.grandTotal = this.cartInfo['grand_total'] || 0;
      }
      else {
        this.grandTotal = 0;
      }
      this.grandTotalDetail.emit(this.grandTotal);


    }


  }
  continueShipping() {
    if (!this.currentSelectedAddress) {
      return;
    }
    var dataCheckout = {
      first_name: this.currentSelectedAddress.name,
      last_name: this.currentSelectedAddress.last_name,
      email: this.userInfo.email,
      address2: this.currentSelectedAddress.address,
      city: this.currentSelectedAddress.city,
      country: "IN",
      state: this.currentSelectedAddress.state,
      zip: this.currentSelectedAddress.pincode,
      phone: this.currentSelectedAddress.mobile,
      add_id: this.currentSelectedAddress.add_id,
      default: this.currentSelectedAddress.default
    };

    this.shippingDetails.emit(dataCheckout);

    // this.router.navigate(['/checkout/payment']);

  }



  ngOnInit() {
    this.totalBagDiscount = 0;
    this.grandTotal = 0;
    this.getBagDiscount();

  }

  viewclick() {
    this.bagdetails = true;
    this.viewdetails = false;
    this.hidedetails = true;
  }
  hideclick() {
    this.bagdetails = false;
    this.viewdetails = true;
    this.hidedetails = false;
  }

  ngOnDestroy(): void {
    this.totalBagDiscount = 0;
    this.grandTotal = 0;
  }


}
