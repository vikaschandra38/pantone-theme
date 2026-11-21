import {
  Component,
  Input,
  OnChanges,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
  SimpleChanges,
  OnDestroy,
  OnInit
} from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie";
import { wishlistloginpopup } from "@app/products/reducers";
import { Meta, Title } from "@angular/platform-browser";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { AccountComponent } from '../account/account.component';
import { Store } from "@ngrx/store";
import * as fromCart from "../../../../app/cart/reducers/cart.reducer";


@Component({
  selector: "app-shopping-cart",
  templateUrl: isDesktop
    ? "./shopping-cart.component.html"
    : "./shopping-cart.component.mobile.html",
  styleUrls: isDesktop
    ? ["./shopping-cart.component.css"]
    : ["./shopping-cart.component.mobile.css"]
})
export class ShoppingCartComponent implements OnChanges, OnDestroy, OnInit {
  @Input() headerContent: any;
  @Output() cartCloseEvent: EventEmitter<any> = new EventEmitter();
  @Input() cart;
  @Input() isUser;
  @Input() logoutStatus;
  @Input() getCartLoaded;
  @Input() getCartLoading;
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
  @Input() cartforgotpopup;
  @Input() wishlistloginpopup;
  @Input() checkemailregisteredloaded;
  @Input() checkemailregisteredloading;
  @Output() removableItemId: EventEmitter<any> = new EventEmitter();
  @Output() appliedPromoCode: EventEmitter<any> = new EventEmitter();
  @Output() newUserRegistrationInfo: EventEmitter<any> = new EventEmitter();
  @Output() loginInfo: EventEmitter<any> = new EventEmitter();
  @Output() RemoveCouponCo: EventEmitter<any> = new EventEmitter();
  @Output() verifyemailevent: EventEmitter<any> = new EventEmitter();
  @Output() itemupdate: EventEmitter<any> = new EventEmitter();
  @Output() forgetpasswordcartpopup: EventEmitter<any> = new EventEmitter();
  @Output() socialemaildata: EventEmitter<any> = new EventEmitter();
  @Output() updateVariant: EventEmitter<any> = new EventEmitter();
  @Input() socialLoading;
  @Input() socialLoaded;
  @Input() socialloginfailed;
  @Output() cartCloseSocialEvent: EventEmitter<any> = new EventEmitter();
  @Output() closeCartSocialEvent: EventEmitter<any> = new EventEmitter();
  @Output() opencartforgotpopup: EventEmitter<any> = new EventEmitter();
  @Output() openLoginPopup: EventEmitter<any> = new EventEmitter();
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() wishlistLoginPopup: EventEmitter<any> = new EventEmitter();
  @Output() onCartForgotPopup: EventEmitter<any> = new EventEmitter();
  @Output() getProductById: EventEmitter<any> = new EventEmitter();
  @Output() cartItems: EventEmitter<any> = new EventEmitter();

  @Input() productByIdLoaded;
  @Input() productByIdLoading;
  @Input() productById;
  @Input() updateVariantLoading;
  @Input() logoutLoading;
  @Input() logoutLoaded;

  cartItemCount = 0;
  totalBagDiscount = 0;
  grandTotal = 0;
  availablesizes;
  variantList;
  couponopup;
  updatedItemsObject;
  notAvailableItems = [];
  availableItems = [];
  messagePopup = false;
  appliedCoupon = new FormControl("", Validators.required);
  appliedCouponInput = new FormControl("");
  submitted = false;
  showPromoError = false;
  placeOrderSubmitted = false;
  removedOrders = [];
  removedOrdersId = new Map();
  sizepopup = false;
  qtypopup = false;
  loginuser;
  modaloverlay: boolean;
  selectedQty: any;
  selectedQtyNumbers;
  selectedSize: any;
  disabled: boolean = false;
  couponList;
  actualBagTotal = 0;
  totalOrder = 0;
  showmsg: boolean;
  couponVal: any;
  couponValue: any;
  showpromopopup: boolean;
  mobileCartImageWidth = "?tr=w-150";
  applyCouponClicked: boolean;
  public showMinAmmountError: boolean = false;
  public isCouponClicked: Boolean = false;
  // timeoutpopup:any;
  @Output() dologout: EventEmitter<any> = new EventEmitter();
  public sessionTimeout: boolean = false;
  excludecategoryids: any;
  excludecategoryerror: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platform: Object,
    private cookieService: CookieService,
    private router: Router,
    public title: Title,
    public store: Store<any>
  ) {
   /*  this.store.select(fromCart.getCart).subscribe((response) => {
      console.log("---->", response['cart'])
      console.log(this.applyCouponClicked)
      if (this.applyCouponClicked) {
       
        if (response['cart']['discounts']) {
          if (response['cart']['discounts'].length != 0) {
            this.closepopup()
          }
          else {
            this.showPromoError = true
          }
        }
      }
    }); */
    // this.store.select(fromCart.getcouponloaded).subscribe((response)=>{
    //   console.log("loaded",response)
    // });
    // this.store.select(fromCart.getcouponloading).subscribe((response)=>{
    //   console.log("loading",response)
    // })

    this.title.setTitle("Shopping Bag | Pantone");
  }

  sizeclick(item) {
    this.selectedSize = item;
    this.getProductById.emit(item.product_id);


  }

  trackById(index: number, product: any) {

    return product.id;
  }

  ngOnInit(): void {
    if(localStorage.getItem('sessionTimeout')) {
      this.sessionTimeout = true;
    }
    this.totalBagDiscount = 0;
    this.grandTotal = 0;
    this.actualBagTotal = 0;
    this.totalOrder = 0;
    this.getBagDiscount();
    // console.log("cart", this.cart)
  }

  getCoupanCode() {

    var product: any;
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
        this.cart.discounts[0].amount = this.cart.discounts[0].amount;
      }

    }

  }
  getBagDiscount() {

    this.totalBagDiscount = 0;
    this.actualBagTotal = 0;

    /* if(this.getcouponloaded==true){
      this.popupmodel();
    } */

    if (this.cart && this.cart.discounts) {
      if (this.cart.discounts.length != 0) {
        this.getCoupanCode();
      }
    }
    if (this.cart && this.cart.items) {
      this.actualBagTotal = this.cart.items.reduce(function (acc, obj) {
        if(obj.variant === null){
          return acc + (obj.product.price) * obj.quantity;
        }else{
          return acc + (obj.variant.price) * obj.quantity;
        }

      }, 0);

      this.totalBagDiscount = this.cart.items.reduce(function (acc, obj) {
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
        this.grandTotal = this.cart['grand_total'];
      }
      else {
        this.grandTotal = 0;
      }
    }


  }
  qtyclick(item) {
    this.selectedQty = item;
    let availableqty;
    // const stockLevel = (item && item.hasOwnProperty('variant')) ? item.variant.stock_level : item.product.stock_level;
    // const maxOrderQty = (item && item.hasOwnProperty('variant')) ? parseInt(item.variant.attributes.maximum_order_quantity, 10) : parseInt(item.product.attributes.maximum_order_quantity, 10);

    const stockLevel = item.product.stock_level;
    const maxOrderQty = parseInt(item.product.attributes.maximum_order_quantity, 10);
    if (stockLevel > maxOrderQty) {
      availableqty = maxOrderQty;
    } else {
      availableqty = stockLevel;

    }
    this.selectedQtyNumbers = Array(availableqty).fill(1).map((x, i) => i + 1);
    this.qtypopup = true;
    this.modaloverlay = true;
  }
  closesizeqty() {
    this.sizepopup = false;
    this.qtypopup = false;
    this.modaloverlay = false;
  }
  ngOnChanges(changes: SimpleChanges) {

    this.subscribeToPopupChanges(changes);
    if (changes.hasOwnProperty("cart") && this.cart) {
      if (
        !_.isEqual(changes["cart"].currentValue, changes["cart"].previousValue)
      ) {
        if (this.cart.items) {
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
          if (this.cart.items) {
            this.cart.items.forEach(item => {
              if (item) {
                this.cartItemCount = this.cartItemCount + item.quantity;
              }
            });
          }
        }
      }
    }
    if (changes.hasOwnProperty('productByIdLoaded') && this.productByIdLoaded) {
      if (this.productById) {
        this.variantList = this.productById.hits[0].options[0].values;
        this.availablesizes = this.productById.hits[0].in_stock_variant_size.size.map(el => el.size);

        this.sizepopup = true;

        this.modaloverlay = true;
      }
      else {

        this.sizepopup = false;

        this.modaloverlay = false;
      }
    }
  }

  subscribeToPopupChanges(changes) {
    if (
      this.wishlistloginpopup &&
      changes.hasOwnProperty("wishlistloginpopup")
    ) {
      this.wishlistLoginPopup.emit(this.wishlistloginpopup);
    }
    if (this.cartforgotpopup && changes.hasOwnProperty("cartforgotpopup")) {
      this.onCartForgotPopup.emit(this.cartforgotpopup);
    }
    if (this.isUser && this.isUser.email) {
      // this.cookieService.set('loginuser', this.isUser.email);
      this.closePopup.emit();
      this.logoutStatus = false;
    }
    if (this.cookieService.get("loginuser")) {
      this.loginuser = this.cookieService.get("loginuser");
    }
    if (this.logoutStatus) {
      this.loginuser = null;
      this.cookieService.remove("loginuser");
      this.logoutStatus = false;
    }
    if (this.getcouponloaded && !this.getcouponloading) {
      if(this.cart.discount_total == 0 && this.cart.coupon_code == null){  
        this.showPromoError = true;
        this.excludecategoryerror = false;
      }else if(this.cart.discount_total == 0 && (this.cart && this.cart.discounts && this.cart.discounts[0] && this.cart.discounts[0].rule && this.cart.discounts[0].rule.exclude_category_ids)){  
        this.showPromoError = false;
        this.excludecategoryerror = true;
        this.showMinAmmountError = true;
      }else if(this.cart && this.cart.discounts && this.cart.discounts[0] && this.cart.discounts[0].amount > 0){
        this.showPromoError = false;
        this.excludecategoryerror = false;
        this.couponopup = false;
        this.appliedCouponInput.reset();
        this.applyCouponClicked = false;
      }
    }
    
    // if (this.getcouponloaded && !this.getcouponloading) {
    //   this.couponopup = false;
    //   this.appliedCouponInput.reset();
    //   this.showPromoError = false;
    //   this.applyCouponClicked = false;
    // } else if (this.getcouponfailure && !this.getcouponloading) {
    //   this.showPromoError = true;
    //   this.applyCouponClicked = true;
    // }
  }

  scrollTop() {
    if (isPlatformBrowser(this.platform)) {
      window.scrollTo({
        top: 0,
        left: 0
      });
    }
    if (isPlatformServer(this.platform)) {
    }
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
    this.appliedCouponInput.reset();
    this.showPromoError = false;
    this.applyCouponClicked = false
    this.showPromoError = false;
    this.excludecategoryerror = false;
    this.showMinAmmountError = false;
  }

  decreaseCartItems(item) {
    if (item.quantity > 1) {
      const product_id = item.product_id;
      const item_id = item.id;
      const quantity = item.quantity - 1;
      this.updatedItemsObject = {
        id: product_id,
        items: [
          {
            id: item_id,
            quantity: quantity
          }
        ]
      };
      this.itemupdate.emit(this.updatedItemsObject);
    }
  }
  increaseCartItems(item) {
    const product_id = item.product_id;
    const item_id = item.id;
    const quantity = item.quantity + 1;
    this.updatedItemsObject = {
      id: product_id,
      items: [
        {
          id: item_id,
          quantity: quantity
        }
      ]
    };
    this.itemupdate.emit(this.updatedItemsObject);
  }

  removeItem(event) {
    this.removableItemId.emit(event);
  }
  checksize(size) {
    if (this.availablesizes.includes(size)) {
      return false;
    } else {

      return true;
    }

  }
  goBack() {
    window.history.back();
  }
  placeOrder() {
    if (!this.loginuser) {
      console.log("1");
      this.openLoginPopup.emit();
      return;
    }
    this.placeOrderSubmitted = true;
    if (this.unavailableStockQty()) {
      this.openCloseMessagePopup(true);
      return;
    }
    this.placeOrderSubmitted = false;
    if(localStorage.getItem('sessionTimeout')) {
      this.sessionTimeout = true;
    } else {
      this.router.navigate(["/checkout/address"]);
    }
  }
  makeprice(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
  }
  percentage(sale_price, price) {
    let results = 0;
    if (sale_price < price) {
      let diff = price - sale_price;
      results = Math.floor((diff / price) * 100);
    }
    return results;
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

  RemoveAppliedCoupon() {
    this.appliedCoupon.reset();
    this.RemoveCouponCo.emit(true);
  }
  // onEnterKey(event) { 
  //   let couponValue = event.target.value;
  //   if (!couponValue) {
  //     this.showPromoError = true;
  //     return;
  //   }
  //   this.showPromoError = false;
  //   let checkCouponObj = this.isCouponValid(couponValue);
  //   if (event.keyCode == 13) {
  //     if (checkCouponObj["isValid"]) {
  //       this.appliedCoupon.patchValue(checkCouponObj["couponId"]);
  //       this.applycoponCode();
  //       // this.appliedCoupon.patchValue(checkCouponObj['couponId']);
  //     } else {
  //       this.showPromoError = true;
  //     }
  //   }
  // }
  /* onEnterKey(event) {
    if (event.keyCode == 13) {
      this.couponValue = event.target.value
      this.applyPromoCode(this.couponVal);
    } */
    onEnterKey(event) {
    // console.log(" key enter",  event.target.value)
     this.showmsg = false;
     this.showPromoError = false;
     this.couponVal = event.target.value;
     if (event.keyCode == 13) {
       this.couponValue = event.target.value;
      // if (this.checkValid()) {
         this.applyPromoCode(this.couponVal);
       // this.closepopup();
      } else {
       //this.showPromoError = true;
       }

  }
  checkValid() {

    var result = [];
    if (this.coupons && this.coupons.results) {
      result = this.coupons.results.filter(
        element => element.name == this.couponVal
      );
    }
    if (!this.couponVal) {
      return true;
    }
    if (
      this.couponVal === undefined ||
      this.couponVal === "" ||
      this.couponVal === null
    ) {
      return false;
    }
    return result.length > 0 ? true : false;
  }
  popupmodel() {

    if (this.cart && this.cart.discounts) {
      if (this.cart && this.cart.discounts.length != 0) {
        this.couponopup = !this.couponopup;
        this.appliedCouponInput.reset();
        this.showPromoError = false;
      }
      else {
        this.showPromoError = true

      }
    }

  }

 
  applyPromoCode(code) {
    this.excludecategoryids = [];
    this.isCouponClicked = true;
    this.showMinAmmountError = false;
    if (code !== "") {
      // if (this.coupons.results.length > 0) {
        const data = this.coupons.results.filter(element => element.name.includes(code));
        
        this.coupons.results.forEach(element => {
          if(element && element.discounts && element.discounts[0] && element.discounts[0].exclude_category_ids){
            this.excludecategoryids.push(element.discounts[0].exclude_category_ids)
            this.applyCouponClicked = true
            this.appliedPromoCode.emit(code);
            return;
          }
          });
          // console.log("excludecategoryids", this.excludecategoryids)
        if(data.length > 0 || this.excludecategoryids > 0){
          data.forEach(element => {
            if (element.discounts[0].total_min && this.cart['grand_total'] >= element.discounts[0].total_min) {
              this.applyCouponClicked = true
              this.appliedPromoCode.emit(code);
              return;
            } else if (element.discounts[0].total_min && this.cart['grand_total'] < element.discounts[0].total_min) {
              this.showMinAmmountError = true;
              return;
            }
            else {
              this.applyCouponClicked = true
              this.appliedPromoCode.emit(code);
              return;
            }
          });
          return;
        }
        else{
          this.appliedPromoCode.emit(code);
          this.showPromoError = false;
        }
      // }
      // this.showPromoError = true;
      // console.log("last ")
    } 
     else {
      // console.log("last else")
     this.showPromoError = true;
     }
  }

  
  // applyPromoCode(code) {
 
  //   this.isCouponClicked = true;
  //   this.showMinAmmountError = false;
  //   if (code !== "") {
  //     if (this.coupons.results.length > 0) {
  //       const data = this.coupons.results.filter(element => element.name.includes(code));
  //       console.log("data",data)
  //       if(data.length){
  //         data.forEach(element => {
  //           if (element.discounts[0].total_min && this.cart['grand_total'] >= element.discounts[0].total_min) {
  //             this.applyCouponClicked = true
  //             this.appliedPromoCode.emit(code);
  //             return;
  //           } else if (element.discounts[0].total_min && this.cart['grand_total'] < element.discounts[0].total_min) {
  //             this.showMinAmmountError = true;
  //             return;
  //           } else {
  //             this.applyCouponClicked = true
  //             this.appliedPromoCode.emit(code);
  //             return;
  //           }
  //         });
  //       }else{
  //         console.log("else")
  //         this.showPromoError = true;
  //       }
  //     }
  //   } 
  //    else {
  //     console.log("last else")
  //    this.showPromoError = true;
  //    }
  // }

  closepromopopup() {
    this.showpromopopup = false;
  }
  // applyPromoCode(code) {
  //   this.submitted = true;
  //   this.showPromoError = false;

  //   // let checkCouponObj = this.isCouponValid(code);
  //   // if (checkCouponObj["isValid"]) {
  //   if (code) {
  //     this.submitted = false;
  //     this.appliedPromoCode.emit(code);
  //     this.closepopup();
  //     return;
  //   }
  //   if (!this.appliedCoupon.valid) {
  //     return;
  //   }
  //   this.submitted = false;
  //   this.appliedPromoCode.emit(this.appliedCoupon.value);
  //   this.closepopup();
  //   // }

  //   // else {
  //   //   this.showPromoError = true;

  //   // }
  // }
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

  clearCouponFields() {
    this.appliedCoupon.patchValue(this.cart.coupon_code);
    this.showPromoError = false;
    this.closepopup();
  }

  openCloseMessagePopup(value) {
    this.messagePopup = value;
  }
  updateQty(qty) {
    const product_id = this.selectedQty.product_id;
    const item_id = this.selectedQty.id;
    const quantity = qty;
    this.updatedItemsObject = {
      id: product_id,
      items: [
        {
          id: item_id,
          quantity: quantity
        }
      ]
    };
    this.itemupdate.emit(this.updatedItemsObject);
    this.closesizeqty();
  }

  updateSize(size) {
    if (this.selectedSize.variant.name != size.name) {
      const variantObject = {
        product_id: this.selectedSize.product_id,
        options: [
          { id: this.productById.hits[0].options[0].id, value: size.id }
        ],
        item_id: this.selectedSize.id
      };

      this.updateVariant.emit(variantObject);
      this.closesizeqty();
    }
  }

  scrollToDetails() {
    document
      .getElementById("viewDetails")
      .scrollIntoView({ behavior: "smooth" });
  }


  couponLoop() {
    if (this.coupons && this.coupons.results) {
      this.couponList = this.coupons.results.filter((cc) => {
        if (!(cc.description == null || cc.active == false)) {
          return cc;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.totalBagDiscount = 0;
    this.grandTotal = 0;
  }

  /**
   * logout from the system
   * @method logout
   */
  public logout() {
    this.logoutLoading = true;
    localStorage.removeItem('sessionTimeout');
    this.dologout.emit();
  }

}

