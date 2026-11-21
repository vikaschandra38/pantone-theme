import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { mobile } from "@env/environment";
import { CookieService } from "ngx-cookie";
import * as _ from "lodash";

@Component({
  selector: "app-cart-item-preview",
  templateUrl: mobile
    ? "./cart-item-preview.component.mobile.html"
    : "./cart-item-preview.component.html",
  styleUrls: mobile
    ? ["./cart-item-preview.component.mobile.css"]
    : ["./cart-item-preview.component.css"]
})
export class CartItemPreviewComponent implements OnInit {
  @Input() items;
  @Output() cartItemId: EventEmitter<any> = new EventEmitter();
  @Output() removeItemGTM: EventEmitter<any> = new EventEmitter();
  selectedSize: any;
  @Output() getProductById: EventEmitter<any> = new EventEmitter();
  @Output() cartItems: EventEmitter<any> = new EventEmitter();
  @Output() removableItemId: EventEmitter<any> = new EventEmitter();
  @Output() itemupdate: EventEmitter<any> = new EventEmitter();
  @Output() updateSizeVariant: EventEmitter<any> = new EventEmitter();

  @Input() productById;
  @Input() productByIdLoaded;
  selectedQtyNumbers;
  @Input() sizepopup;
  qtypopup = false;
  selectedQty: any;
  @Input() modalsizeoverlay;
  modaloverlay;
  @Input() variantList;
  @Input() availablesizes;
  @Input() getcartqtyloading;
  @Input() cart;
  availableItems = [];
  notAvailableItems = [];
  removedOrdersId = new Map();
  removedOrders = [];
  @Input() cartforgotpopup;
  @Input() wishlistloginpopup;
  @Output() wishlistLoginPopup: EventEmitter<any> = new EventEmitter();
  @Output() onCartForgotPopup: EventEmitter<any> = new EventEmitter();
  @Input() isUser;
  @Input() logoutStatus;
  updatedItemsObject;
  loginuser;
  couponopup;
  totalQuantity:any;
  @Output() updateQuantity: EventEmitter<any> = new EventEmitter();
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Output() claoseminicart: EventEmitter<any> = new EventEmitter();
  cartItemCount = 0;

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    

  }
  ngOnChanges(changes: SimpleChanges) {
     this.totalQuantity=0;
    this.items.forEach(element => {
      this.totalQuantity=this.totalQuantity+element.quantity;
    });
    console.log('this.totalQuantity',this.totalQuantity); 
   
        this.subscribeToPopupChanges(changes);
    if (changes.hasOwnProperty("cart") && this.cart) {
      if (
        !_.isEqual(changes["cart"].currentValue, changes["cart"].previousValue)
      ) {
        if (this.cart.items) {
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
      
          

        }
      }
    }
    if (changes.hasOwnProperty("variantList")) {
      // if (this.productById) {
      //   console.log(this.productById.hits);
      //   this.variantList = this.productById.hits[0].options[0].values;
      //   this.availablesizes = this.productById.hits[0].in_stock_variant_size.size.map(el => el.size);
      //   console.log(this.variantList);
      if (this.variantList && this.variantList.length) {
        this.sizepopup = true;

        this.modaloverlay = true;
      }
    } else {
      this.sizepopup = false;

      this.modaloverlay = false;
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
  }
  closepopup() {
    this.couponopup = !this.couponopup;
  }
  removeItem(item) {
    this.cartItemId.emit(item);
    //this.removeItemGTM.emit(item);
    this.removableItemId.emit(event);
  }
  checksize(size) {
    if (this.availablesizes.includes(size)) {
      return false;
    } else {
      return true;
    }
  }

  sizeclick(item) {
    this.selectedSize = item;
    this.getProductById.emit(item.product_id);
  }

  updateSize(size) {
    if (this.selectedSize.variant.name != size.name) {
      // this.removableItemId.emit(this.selectedSize.id);

      const variantObject = {
        product_id: this.selectedSize.product_id,
        options: [
          { id: this.productById.hits[0].options[0].id, value: size.id }
        ],
        item_id: this.selectedSize.id
      };
      this.updateSizeVariant.emit(variantObject);
      //this.cartItems.emit(variantObject);
      this.closesizeqty();
    }
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

  qtyclick(item) {
    this.selectedQty = item;
    let availableqty;
    const stockLevel =
      item && item.hasOwnProperty("variant") && item.variant != null
        ? item.variant.stock_level
        : item.product.stock_level;
    const maxOrderQty =
      item && item.hasOwnProperty("variant") && item.variant != null
        ? parseInt(item.variant.attributes.maximum_order_quantity, 10)
        : parseInt(item.product.attributes.maximum_order_quantity, 10);
    if (stockLevel > maxOrderQty) {
      availableqty = maxOrderQty;
    } else {
      availableqty = stockLevel;
    }
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

  // makeprice(price) {
  //   const initial = (price - (price % 1000)) / 1000;
  //   const final = price % 1000;
  //   return initial + "," + final;
  // }
  makeprice(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
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
      this.updateQuantity.emit(this.updatedItemsObject);
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
    this.updateQuantity.emit(this.updatedItemsObject);
  }

  closeCart(){
    this.claoseminicart.emit();
  }
}
