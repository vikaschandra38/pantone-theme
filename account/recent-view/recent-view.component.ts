import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Input,
  PLATFORM_ID,
  Inject
} from "@angular/core";
import { CookieService } from "ngx-cookie";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserWishlist } from "@app/products/actions/products.actions";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

@Component({
  selector: "app-recent",
  templateUrl: "./recent-view.component.html",
  styleUrls: ["./recent-view.component.css"]
})
export class RecentviewComponent implements OnInit, OnChanges {
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
  recentlyViewed = [];
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
  showPosn: any;
  activesize: any;
  showsizeschartoverlay: false;
  constructor(
    private cookieservice: CookieService,
    @Inject(PLATFORM_ID) private platform: Object
  ) {}

  ngOnInit() {}

  selectedSize(sizeID) {
    this.activesize = sizeID;
    //console.log(sizeID);
    this.wishlistItemSelectedSizeID = sizeID;
  }

  ngOnChanges() {
    if (isPlatformBrowser(this.platform)) {
      // here you can run any browser specific code, like:
      //window.alert('This will run only in the browser!');
      // this.categoryslug = window.location.pathname;
      var recnt_viewed = JSON.parse(localStorage.getItem("recent_viewed"));
      if (recnt_viewed) {
        this.recentlyViewed = recnt_viewed;
        // this.slider = (this.recentlyViewed).slice(this.first, this.last);
      }
    }
    if (isPlatformServer(this.platform)) {
      // here you can run any browser specific code, like:
      //window.alert('This will run only in the browser!');
    }

    //console.log(this.selectedProduct);
    //console.log(this.userwishlist);
    //this.allwishlist = this.userwishlist;
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
    //console.log(id);
    this.newWishlistArray = this.allwishlist.filter(
      wishlist => wishlist.wislist_id !== id
    );
    //console.log(this.newWishlistArray);
    this.removedWishlistData.emit(this.newWishlistArray);
  }

  addToCart1(data, data2, i) {
    this.activesize = null;
    //console.log(data, data2);
    this.showPosn = i;
    this.showsizechart = true;
    this.moveToCart.emit(data.product_info_slug);
    //this.showsizechart = true;
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

  showsizeschart(i) {
    if (i === this.showPosn) {
      return true;
    } else {
      return false;
    }
  }
  addToCart(data, data2) {
    if (
      this.wishlistItemSelectedSizeID !== null &&
      this.wishlistItemSelectedSizeID !== undefined
    ) {
      this.wishlistItemSelectedSizeID;
      this.showPosn = false;
      this.selectedSizeWishlist.emit(this.wishlistItemSelectedSizeID);
      this.removewishlist(this.removedwishlist);
      this.wishlistItemSelectedSizeID = undefined;
    }
  }
  selectsizeclose() {
    this.showPosn = false;
    this.selectedProduct = null;
  }
}
