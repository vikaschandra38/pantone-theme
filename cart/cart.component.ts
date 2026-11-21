import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Cart } from "@app/cart/models/cart.model";
import { CookieService } from "ngx-cookie";
import { ContentService } from "@theme/contentful/content.service";
import { Router } from "@angular/router";
import { mobile } from "@env/environment";
import * as _ from "lodash";
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { OtpProcessService } from '@app/otp/otp-process.service';
@Component({
  selector: "app-cart",
  templateUrl: mobile
    ? "./cart.component.mobile.html"
    : "./cart.component.html",
  styleUrls: mobile ? ["./cart.component.mobile.css"] : ["./cart.component.css"]
})
export class CartComponent implements OnInit, OnChanges {
  @Input() headerContent: any;
  @Output() cartCloseEvent: EventEmitter<any> = new EventEmitter();
  @Input() cart;
  @Input() coupons;
  @Input() emailStats;
  @Input() itemadding;
  @Input() itemadded;
  @Input() loginloading;
  @Input() loginloaded;
  @Input() loginfailed;
  @Input() loginloaded2;
  @Input() signupinitiating;
  @Input() signupsuccess;
  @Input() signupsuccess2;
  @Input() signupfailure;
  @Input() getcartqtyloading;
  @Input() getcartqtyloaded;
  @Input() getcouponfailure;
  @Input() getcouponloading;
  @Input() getcouponloaded;
  @Input() getremovecouponfailure;
  @Input() getremovecouponloading;
  @Input() getremovecouponloaded;
  @Input() getremoveitemfailure;
  @Input() getremoveitemloading;
  @Input() getremoveitemloaded;
  @Input() checkemailregisteredloaded;
  @Input() checkemailregisteredloading;
  @Output() removableItemId: EventEmitter<any> = new EventEmitter();
  @Output() getcartlist: EventEmitter<any> = new EventEmitter();
  @Output() appliedPromoCode: EventEmitter<any> = new EventEmitter();
  @Output() newUserRegistrationInfo: EventEmitter<any> = new EventEmitter();
  @Output() loginInfo: EventEmitter<any> = new EventEmitter();
  @Output() RemoveCouponCo: EventEmitter<any> = new EventEmitter();
  @Output() verifyemailevent: EventEmitter<any> = new EventEmitter();
  @Output() itemupdate: EventEmitter<any> = new EventEmitter();
  @Output() forgetpasswordcartpopup: EventEmitter<any> = new EventEmitter();
  @Output() socialemaildata: EventEmitter<any> = new EventEmitter();

  @Output() removeCartDataGtm: EventEmitter<any> = new EventEmitter();

  @Input() socialLoading;
  @Input() socialLoaded;
  @Input() socialloginfailed;
  @Output() cartCloseSocialEvent: EventEmitter<any> = new EventEmitter();
  @Output() closeCartSocialEvent: EventEmitter<any> = new EventEmitter();
  @Output() opencartforgotpopup: EventEmitter<any> = new EventEmitter();
  cartItemCount;
  couponValue: string;
  showPreviewBool = true;
  showCheckoutBool = false;
  showRegisterBool = false;
  showShippingBool = false;
  showpromopopup = false;
  promoerrormessage: boolean = false;
  loginstatus: any;
  verifyemail: string;
  cartdata: any;
  cartTitle: any;
  couponVal: any;
  showmsg: boolean;
  availableItems = [];
  availablesizes;
  notAvailableItems = [];
  removedOrders = [];
  removedOrdersId = new Map();
  @Input() productByIdLoaded;
  @Input() productById;
  @Input() productByIdLoading;
  @Input() updateVariantLoading;
  variantList;
  sizepopup = false;
  modaloverlay: boolean;
  selectedSize: any;
  qtypopup = false;
  selectedQty: any;
  selectedQtyNumbers;
  @Output() getProductById: EventEmitter<any> = new EventEmitter();
  @Output() cartItems: EventEmitter<any> = new EventEmitter();
  @Output() updateVariant: EventEmitter<any> = new EventEmitter();
  addSubscription$ = new Subscription();
  appliedCoupon = new FormControl("", Validators.required);
  appliedCouponInput = new FormControl("");
  couponopup;
  couponList;
  showPromoError = false;
  messagePopup = false;
  submitted = false;
  totalBagDiscount = 0;
  grandTotal = 0;
  actualBagTotal = 0;
  totalOrder=0;
  public loginpopup: boolean = false;
  public overlaypupup: boolean = false;
  public loginSignUpPopup: boolean = false;
  public couponListRef: any;

  public showMinAmmountError: boolean = false;
  public isCouponClicked: Boolean = false;
  public applyCouponClicked: Boolean = false;
  public sidecart:boolean = false;
  constructor(
    private cookieservice: CookieService,
    public contentservice: ContentService,
    private router: Router,
    private otpProcessService: OtpProcessService
  ) {
    
    // console.log(this.showRegisterBool, this.showCheckoutBool);
    this.loginstatus = this.cookieservice.get("loginuser");
    this.addSubscription$.add(
      this.contentservice.getContentfulHeaderData().subscribe(content => {
        if (content) {
          this.cartdata = content;
          if (
            this.cartdata &&
            this.cartdata.menuItems &&
            this.cartdata.menuItems[9] &&
            this.cartdata.menuItems[9].fields &&
            this.cartdata.menuItems[9].fields.menuSubcategory &&
            this.cartdata.menuItems[9].fields.menuSubcategory[0] &&
            this.cartdata.menuItems[9].fields.menuSubcategory[0].fields &&
            this.cartdata.menuItems[9].fields.menuSubcategory[0].fields
              .subcategoryTitle
          ) {
            this.cartTitle = this.cartdata.menuItems[9].fields.menuSubcategory[0].fields.subcategoryTitle;
          }
          // console.log("cart content");
          // console.log(this.cartTitle);
        }
      }));
  }
  unavailableStockQty() {
    for (let index = 0; index < this.availableItems.length; index++) {
      let availableStock = this.availableItems[index].variant
        ? this.availableItems[index].variant.stock_level
        : this.availableItems[index].product.stock_level;
      if (availableStock < this.availableItems[index].quantity) {
        return true;
      }
    }
    return false;
  }
  checksize(size) {
    if (this.availablesizes.includes(size)) {
      return false;
    } else {
      return true;
    }
  }
  qtyclick(item) {
    this.selectedQty = item;
    const availableqty =
      item && item.hasOwnProperty("variant")
        ? item.variant.stock_level
        : item.product.stock_level;
    this.selectedQtyNumbers = Array(availableqty)
      .fill(1)
      .map((x, i) => i + 1);
    this.qtypopup = true;
    this.modaloverlay = true;
  }
  closesizeqty() {
    this.sizepopup = false;
    this.qtypopup = false;
    this.modaloverlay = false;
  }
  sizeclick(event) {
    // console.log(item);
    // this.selectedSize = item;
    this.getProductById.emit(event);
  }
  couponclick(shouldPatch) {
    
    if (shouldPatch) {
      this.appliedCoupon.patchValue(this.cart.coupon_code);
    }
    this.couponopup = !this.couponopup;
    this.appliedCouponInput.reset();
    this.showPromoError=false;
    this.couponLoop();
  }
  closepopup() {
    
    this.couponopup = !this.couponopup;
    this.showPromoError=false;
     this.appliedCouponInput.reset();
  }
  clearCouponFields() {
    this.appliedCoupon.patchValue(this.cart.coupon_code);
    this.showPromoError = false;
    this.closepopup();
  }
  applycoponCode() {
    this.submitted = true;
    this.showPromoError = false;
    if (!this.appliedCoupon.valid) {
      return;
    }
    this.submitted = false;
    this.appliedPromoCode.emit(this.appliedCoupon.value);
    this.closepopup();
  }
  // applyPromoCode(code) {
    
  //   this.submitted = true;
  //   this.showPromoError = false;
  //   if (code) {
  //     this.submitted = false;
  //     this.appliedPromoCode.emit(code);
  //    // this.popupmodel();
  //     this.closepopup();
  //     return;
  //   }
  //   if (!this.appliedCoupon.valid) {
  //     return;
  //   }
  //   this.submitted = false;
  //   this.appliedPromoCode.emit(this.appliedCoupon.value);
  //   this.closepopup();
  // }
  openCloseMessagePopup(value) {
    this.messagePopup = value;
  }
  couponLoop() {
    this.couponListRef = [];
    this.couponListRef.push('TEST');
    this.couponList = this.coupons.results.filter(cc => {
      this.couponListRef.push(cc.name);
      if (!(cc.description == null || cc.active == false)) {
        return cc;
      }
    });
  }
  updateSize(size) {
    // if (this.selectedSize.variant.name != size.name) {
    //   const variantObject = {
    //     product_id: this.selectedSize.product_id,
    //     options: [
    //       { id: this.productById.hits[0].options[0].id, value: size.id }
    //     ],
    //     item_id: this.selectedSize.id
    //   };

    this.updateVariant.emit(size);
    //this.closesizeqty();
    //}
  }
  ngOnInit() {
    this.loginstatus = this.cookieservice.get("loginuser");
    // console.log('why in container', this.showRegisterBool);
    this.totalBagDiscount = 0;
    this.grandTotal = 0;
    this.totalOrder=0;
    this.getBagDiscount();
    this.subscribeResponse();
  
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.checkemailregisteredloaded && !this.checkemailregisteredloading) {
      this.showRegisterBool = true;
    }
    //console.log(this.headerContent);
    this.loginstatus = this.cookieservice.get("loginuser");
    // this.contentservice.getContentfulHeaderData().subscribe(content => {
    //   if (content) {
    //     this.cartdata = content;
    //     if (
    //       this.cartdata &&
    //       this.cartdata.menuItems &&
    //       this.cartdata.menuItems[9] &&
    //       this.cartdata.menuItems[9].fields &&
    //       this.cartdata.menuItems[9].fields.menuSubcategory &&
    //       this.cartdata.menuItems[9].fields.menuSubcategory[0] &&
    //       this.cartdata.menuItems[9].fields.menuSubcategory[0].fields &&
    //       this.cartdata.menuItems[9].fields.menuSubcategory[0].fields
    //         .subcategoryTitle
    //     ) {
    //       this.cartTitle = this.cartdata.menuItems[9].fields.menuSubcategory[0].fields.subcategoryTitle;
    //     }
    //     console.log("cart content");
    //     console.log(this.cartTitle);
    //   }
    // });
    // this.subscribeToPopupChanges(changes);
    if (changes.hasOwnProperty("cart") && this.cart) {
      if (
        !_.isEqual(changes["cart"].currentValue, changes["cart"].previousValue)
      ) {
        if (this.cart.items) {
          this.showRegisterBool = false;
          this.showCheckoutBool = false;
          this.loginSignUpPopup = this.loginpopup = this.overlaypupup = false;
          this.getBagDiscount();
          this.notAvailableItems = this.cart.items.filter(item => {
            if (item.variant) {
              return item.variant.stock_level <= 0;
            }
            return item.product.stock_level <= 0;
          });
          this.availableItems = this.cart.items.filter(item => {
            if (item.variant) {
              return item.variant.stock_level > 0;
            }
            return item.product.stock_level > 0;
          });
          this.removeUnavailableItems();
          this.cartItemCount = 0;
          // console.log(this.cartdetails);
          if (this.cart.items) {
            this.cart.items.forEach(item => {
              if (item) {
                this.cartItemCount = this.cartItemCount + item.quantity;
                // console.log(item.quantity);
              }
            });
          }
        }
      }
    }
    // console.log(this.productByIdLoaded, 'on ng on changes');
    if (changes.hasOwnProperty("productByIdLoaded") && this.productByIdLoaded) {
      if (this.productById) {
        this.variantList = this.productById.hits[0].options[0].values;
        this.availablesizes = this.productById.hits[0].in_stock_variant_size.size.map(
          el => el.size
        );

        this.sizepopup = true;

        this.modaloverlay = true;
      } else {
        this.sizepopup = false;

        this.modaloverlay = false;
      }
    }

    if (this.getcouponloaded && !this.getcouponloading) {
      this.couponopup = false;
      this.appliedCouponInput.reset();
      this.showPromoError = false;
    } else if (this.getcouponfailure && !this.getcouponloading) {
      this.showPromoError = true;
    }
  }
  getCoupanCode(){
    var product:any;
    if (this.cart && this.cart.items) {
      product = this.cart.items.filter(
        element => element.product["tags"][0] == "Clothing"
      
      );
      this.totalOrder = product.reduce(function (acc, obj) {
        return acc + (obj.price) * obj.quantity;

      }, 0);
      
      if (this.totalOrder > 2500) {
        if(this.cart.discounts.length==1){
          this.cart.discounts[0].amount =  this.cart.discounts[0].amount;
        }else{
      
        this.cart.discounts[0].amount =  this.cart.discounts[1].amount;
      }}
      else {
        this.cart.discounts[0].amount =  this.cart.discounts[0].amount;
      }
  
    }
 
  }
  getBagDiscount() {

    this.totalBagDiscount = 0;
    this.actualBagTotal = 0;
   /*  if(this.getcouponloaded==true){
      this.popupmodel();
    } */
    if (this.cart && this.cart.items) {
      this.actualBagTotal = this.cart.items.reduce(function (acc, obj) {
        return acc + (obj.product.price) * obj.quantity;

      }, 0);

      this.totalBagDiscount = this.cart.items.reduce(function (acc, obj) {
        if (obj.product.price !== obj.product.sale_price) {
          return acc + (obj.product.price - obj.product.sale_price) * obj.quantity;
        }
        else {
          return acc || 0;
        }
      }, 0);
      if (this.totalBagDiscount > 0) {
        this.grandTotal = this.cart['grand_total'];
      }
      else {
        this.grandTotal = 0;
      }
    }
    if (this.cart && this.cart.discounts) {
      if(this.cart.discounts.length != 0){
      this.getCoupanCode();
     
    }}
  }
  isCouponValid(couponValue) {
    let flag = false;
    let actualCouponId = "";
    if (this.coupons.results) {
      for (let index = 0; index < this.coupons.results.length; index++) {
        if (
          (this.coupons.results[index].name || "").toLowerCase() ===
          couponValue.toLowerCase()
        ) {
          flag = true;
          actualCouponId = this.coupons.results[index].name;
          break;
        }
      }
    }
    return { isValid: flag, couponId: actualCouponId };
  }

  removeUnavailableItems() {
    if (this.notAvailableItems.length > 0) {
      this.notAvailableItems.map(item => {
        if (!this.removedOrdersId.has(item.id)) {
          this.removedOrders.push(item);
          this.removedOrdersId.set(item.id, true);
          this.removeItem(item.id);
        }
      });
    }
  }
  registerloginClose() {
    this.cartCloseEvent.emit();
    this.showCheckoutBool = false;
    this.showRegisterBool = false;
    this.loginSignUpPopup = this.loginpopup = this.overlaypupup = false;
  }
  closeCart() {
    this.showPreviewBool = true;
    this.showCheckoutBool = false;
    this.showRegisterBool = false;
    this.loginSignUpPopup = this.loginpopup = this.overlaypupup = false;
    this.cartCloseEvent.emit();
    this.showpromopopup = false;
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("popup-hidden");
    this.getcartlist.emit(event);
  }
  claoseminicart(){
    this.showPreviewBool = true;
    this.showCheckoutBool = false;
    this.showRegisterBool = false;
    this.cartCloseEvent.emit();
    this.showpromopopup = false;
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("popup-hidden");
  }
  removeItem(event) {
    this.removableItemId.emit(event);
  }
  removeItemGtm(event) {
    //console.log("removeItemGtm 1");
    this.removeCartDataGtm.emit(event);
  }
  // RemoveAppliedCoupon() {
  //   this.couponValue = "";
  //   this.RemoveCouponCo.emit(true);
  // }
  RemoveAppliedCoupon() {
    this.appliedCoupon.reset();
    this.RemoveCouponCo.emit(true);
  }
  onEnterKey(event) {
   
    // console.log(" key enter",  event.target.value)
    this.showmsg = false;
    this.showPromoError = false;
    this.couponVal = event.target.value;
    if (event.keyCode == 13) {
      this.couponValue = event.target.value;
      //if (this.checkValid()) {
        this.ApplyPromoCode(this.couponVal);
        // this.closepopup();
      } else {
        //this.showPromoError = true;
      }
    }
  

  checkValid(code) {
    this.couponList.forEach(element => {
      if(element.name == code || 'TEST' == code) {
        this.showPromoError = false;
      } else {
        this.showPromoError = true;
      }
    });
    // this.coupons.results.filter(cc => {
    //   if (cc.name == code) {
    //     this.showPromoError = (cc.description == null || cc.active == false);
    //     return;
    //   } else if(!this.couponListRef.includes(code)) {
    //     this.showPromoError = true;
    //     return;
    //   } else {
        
    //   }
    // });
  }

  checkCouponValid() {
    var result = [];
    if (this.coupons.results && this.coupons.results) {
      result = this.coupons.results.filter(
        element => element.name == this.couponValue
      );
    }
    if (!this.couponValue) {
      return true;
    }
    if (
      this.couponValue === undefined ||
      this.couponValue === "" ||
      this.couponValue === null
    ) {
      return false;
    }
    // console.log('checkCouponValid', this.couponVal)
    return result.length > 0 ? true : false;
  }
  popupmodel(){
   
    if(this.cart && this.cart.discounts){
      if(this.cart && this.cart.discounts.length!=0){
      this.couponopup = !this.couponopup;
        this.appliedCouponInput.reset();
        this.showPromoError = false;
      }
      else{
        this.showPromoError = true
      }
    }
    
      }
  ApplyPromoCode(code) {
    this.isCouponClicked = true;
    this.showMinAmmountError = false;
    if (code !== "") {
      if (this.coupons.results.length > 0) {
        const data = this.coupons.results.filter(element => element.name.includes(code));
        console.log("data",data)
        if(data.length){
          data.forEach(element => {
            if (element.discounts[0].total_min && this.cart['grand_total'] >= element.discounts[0].total_min) {
              this.applyCouponClicked = true
              this.appliedPromoCode.emit(code);
              this.closepromopopup();
              return;
            } else if (element.discounts[0].total_min && this.cart['grand_total'] < element.discounts[0].total_min) {
              this.showMinAmmountError = true;
              return;
            } else {
              this.applyCouponClicked = true
              this.appliedPromoCode.emit(code);
              this.closepromopopup();
              return;
            }
          });
        }else{
          console.log("else")
          this.showPromoError = true;
        }
      }
    } 
     else {
      console.log("last else")
     this.showPromoError = true;
     }
  }
  // clearCouponFields() {
  //   this.couponValue = "";
  //   this.showmsg = false;
  // }
  showerror() {
    // checkCouponValid(){
    this.showmsg = true;
    this.couponValue = this.couponVal;
  }
  changeCouponCode(event, code) {
    this.couponVal = code;
    this.promoerrormessage = false;
    this.couponValue = code;
    this.emailStats = -1;
  }
  closepromopopup() {
    this.showpromopopup = false;
  }
  boxCloseEv(event) {
    this.closeCart();
  }
  openPromoPopup() {
    this.showpromopopup = true;
  }
  showCheckout() {
    this.showPreviewBool = false;
    this.showCheckoutBool = true;
    this.loginSignUpPopup = this.loginpopup = this.overlaypupup = true;
  }
  checkemailregistered(event) {
    this.verifyemail = event;
    this.verifyemailevent.emit(this.verifyemail);
  }
  showRegisterUser() {
    this.showPreviewBool = false;
    this.showCheckoutBool = false;
  }
  changepopupcontent(e) {
    this.showPreviewBool = true;
    this.showCheckoutBool = false;
    this.showRegisterBool = false;
  }
  newUserData(event) {
    //console.log(event);
    this.newUserRegistrationInfo.emit(event);
  }
  showloginpop(e) { }
  loginData(event) {
    //console.log(event);
    this.loginInfo.emit(event);
  }
  updateItemQuantity(event) {
    //console.log(event);
    this.itemupdate.emit(event);
  }
  opencartinitial(e) {
    this.showPreviewBool = true;
    this.showCheckoutBool = false;
    this.showRegisterBool = false;
  }
  get categorySubTitle() {
    let result = "ert";
    return result;
  }

  forgetpasspopup(event) {
    this.forgetpasswordcartpopup.emit(event);
    //console.log("cart.compo.ts");
    this.opencartforgotpopup.emit(true);
    this.closeCart();
  }

  socialsignupdata(event) {
    // console.log(event);
    this.socialemaildata.emit(event);
  }

  cartCloseSocialEventCart() {
    this.closeCartSocialEvent.emit();
  }
  onCheckout() {
    //console.log('gtm issue');
    if (this.isStockUnavailable()) {
      this.closeCart();
      this.router.navigate(["/checkout/cart"]);
      return;
    }
    this.closeCart();
    this.router.navigate(["/checkout/cart"]);
  }
  scrollToDetails() {
    document
      .getElementById("viewDetails")
      .scrollIntoView({ behavior: "smooth" });
  }
  isStockUnavailable() {
    let cartItems = this.cart.items;
    for (let index = 0; index < cartItems.length; index++) {
      let availableStock = cartItems[index].variant
        ? cartItems[index].variant.stock_level
        : cartItems[index].product.stock_level;
      if (availableStock <= 0 || availableStock < cartItems[index].quantity) {
        return true;
      }
    }
    return false;
  }
  ngOnDestroy(): void {
    //console.log('destroyed cart compo');
    this.addSubscription$.unsubscribe();
    this.showRegisterBool = false;
    this.showCheckoutBool = false;
  }

  /**
   * @method subscribeResponse
   */
  public subscribeResponse() {
    if(this.otpProcessService && this.otpProcessService.loginRespObs) {
      this.otpProcessService.loginRespObs.subscribe((response: any) => {
        if(response && response.email) {
          this.loginloaded = true;
          if (this.cart && this.cart.items && this.cart.items.length > 0) {
            this.closeCart();
            this.router.navigate(["/checkout/address"]);
          }
        }
      })
    }
  }

  public loginstatusshow(){
    return this.cookieservice.get("loginuser") ? true : false; 
  }
}
