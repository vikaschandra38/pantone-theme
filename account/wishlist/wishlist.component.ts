import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { CookieService } from "ngx-cookie";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserWishlist } from "@app/products/actions/products.actions";
import { mobile } from "@env/environment";
@Component({
  selector: "app-wishlist",
  templateUrl: mobile
    ? "./wishlist.component.mobile.html"
    : "./wishlist.component.html",
  styleUrls: mobile
    ? ["./wishlist.component.mobile.css"]
    : ["./wishlist.component.css"]
})
export class WishlistComponent implements OnInit, OnChanges {
  emptywishlist: boolean;
  wishlist: boolean;

  @Input() userwishlist;
  @Input() userwishlistloading;
  @Input() userwishlistloaded;
  @Input() itemaddingcart;
  @Input() wishlistremoveloading;
  @Input() wishlistremoveloaded;
  @Input() wishlistremovefailure;
  @Input() wishlistnullloaded;
  allwishlist: any;
  wishlistday: any;
  dateofwishlist: string;
  newWishlistArray: any;
  @Output() removedWishlistData: EventEmitter<any> = new EventEmitter();
  allProductData: any;
  prod_id: any;
  optionData: any;
  @Output() cartItems: EventEmitter<any> = new EventEmitter();
  allwishlistNew: any;
  wishlistCount: any;
  showsizechart: boolean;
  @Output() moveToCart: EventEmitter<any> = new EventEmitter();
  @Input() selectedProduct;
  wishlistItemSelectedSizeID: any;
  @Output() selectedSizeWishlist: EventEmitter<any> = new EventEmitter();
  removedwishlist: any;
  activesize: any;
  showSelectSize: boolean = false;
  showPosn: any;

  constructor(private cookieservice: CookieService) {}

  ngOnInit() {}

  selectedSize(sizeID) {
    this.wishlistItemSelectedSizeID = sizeID;
    this.activesize = sizeID;
  }
  showsizeschart(i) {
    if (i === this.showPosn) {
      return true;
    }else{
      return false;
    }
  }
  ngOnChanges() {
   
    this.allwishlist = this.userwishlist;
    if (this.allwishlist && this.allwishlist.length > 0) {
      this.emptywishlist = false;
      this.wishlist = true;
      this.wishlistCount = this.allwishlist.length;
    } else {
      this.wishlist = false;
      this.emptywishlist = true;
      this.wishlistCount = 0;
    }

    if (this.wishlistremoveloaded) {
      this.allwishlistNew = this.userwishlist;
      this.userwishlistloading = false;
      this.userwishlistloaded = true;
    }
  }

  removewishlist(id) {
    this.userwishlistloading = true;
    this.userwishlistloaded = false;
    this.newWishlistArray = this.allwishlist.filter(
      wishlist => wishlist.wislist_id !== id
    );
    this.removedWishlistData.emit(this.newWishlistArray);
  }

  addToCart(data, data2) {
    this.moveToCart.emit(data.product_info_slug);
    this.showsizechart = true;
    // this.userwishlistloading = true;
    // this.userwishlistloaded = false;
    //  console.log(data);
    //  this.allProductData = data;
    //  const variantObject = {
    //   'product_id': this.allProductData.product_id,
    //   'options': [{ 'id' : this.allProductData.options[0].id, 'value': this.allProductData.options[0].value }]
    // };
    // console.log(variantObject);
    // this.cartItems.emit(variantObject);
    this.removedwishlist = data2;
  }
  closesizeblock() {
    this.showsizechart = false;
    this.selectedProduct = null;
  }
  addToCart1() {
    if (
      this.wishlistItemSelectedSizeID !== null &&
      this.wishlistItemSelectedSizeID !== undefined
    ) {
      this.wishlistItemSelectedSizeID;
      this.showsizechart = false;
      this.selectedSizeWishlist.emit(this.wishlistItemSelectedSizeID);
      this.removewishlist(this.removedwishlist);
      this.wishlistItemSelectedSizeID = undefined;
    } else {
      this.showSelectSize = true;
      setTimeout(() => {
        this.showSelectSize = false;
      }, 3000);
    }
  }
}
