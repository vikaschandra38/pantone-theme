import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Store } from "@ngrx/store";
// import * as cart from '../../../cart/actions/cart.actions';
import * as user from "@app/user/actions/user.actions";
import * as product from "@app/products/actions/products.actions";
import * as fromUser from "@app/user/reducers";
import * as fromProduct from "@app/products/reducers";
import { Router, ActivatedRoute } from "@angular/router";
import * as fromCart from "@app/cart/reducers";
import * as cart from "@app/cart/actions/cart.actions";
import { Product } from "@app/products/models/product.model";
import { mobile } from "@env/environment";
import { UserService } from "@app/shared/services/user.service";

// import * as fromContent from '../../../reducers';
// import * as content from '../../../shared/actions/content.actions';
@Component({
  selector: "app-user-account",
  templateUrl: mobile
    ? "./user-account.component.mobile.html"
    : "./user-account.component.html",
  styleUrls: mobile
    ? ["./user-account.component.mobile.css"]
    : ["./user-account.component.css"],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAccountContainer implements OnInit {
  @Input() logoutStatus;
  @Output() dologout: EventEmitter<any> = new EventEmitter();
  userprofileInfo: Observable<any>;
  appProfile: boolean = true;
  OrdersReturns: boolean = false;
  addnewaddress: boolean = false;
  SaveCards: boolean = false;
  rewardpoint: boolean = false;
  wishlist: boolean = false;
  newsletter: boolean = false;
  accountmain = false;
  accountlinks = true;
  userprofilesubmitfailure: Observable<boolean>;
  userprofilesubmitloading: Observable<boolean>;
  userprofilesubmitloaded: Observable<boolean>;
  userorders: Observable<any>;
  useraddress: any[];
  allAddresses: Observable<any[]>;
  alladdressloading: Observable<boolean>;
  alladdressloaded: Observable<boolean>;
  useraddresssaveloading: Observable<boolean>;
  useraddresssaveloaded: Observable<boolean>;
  useraddresssavefailure: Observable<boolean>;
  usereditaddresssaveloading: Observable<boolean>;
  usereditaddresssaveloaded: Observable<boolean>;
  usereditaddresssavefailure: Observable<boolean>;
  allCards: Observable<any>;
  usercards: any[];
  usercardsaveloading: Observable<boolean>;
  usercardsaveloaded: Observable<boolean>;
  usercardsavefailure: Observable<boolean>;
  useraddressremoveloading: Observable<boolean>;
  useraddressremoveloaded: Observable<boolean>;
  useraddressremovefailure: Observable<boolean>;
  useraddressnullloading: Observable<boolean>;
  useraddressnullloaded: Observable<boolean>;
  useraddressnullfailure: Observable<boolean>;
  carddatatosend: any;
  removedcarddatatosend: any;
  usercardnullloading: Observable<boolean>;
  getusercardnullloaded: Observable<boolean>;
  getusercardnullfailure: Observable<boolean>;
  getusercardremoveloading: Observable<boolean>;
  getusercardremoveloaded: Observable<boolean>;
  getusercardremovefailure: Observable<boolean>;
  usercardeditloading: Observable<boolean>;
  usercardeditloaded: Observable<boolean>;
  usercardeditfailure: Observable<boolean>;
  fragment: string;
  userwishlist: Observable<any>;
  userwishlistloading: Observable<boolean>;
  userwishlistloaded: Observable<boolean>;
  userorderloading: Observable<boolean>;
  userorderloaded: Observable<boolean>;
  wishlistnullloading: Observable<boolean>;
  wishlistnullloaded: Observable<boolean>;
  wishlistnullfailure: Observable<boolean>;
  removedwishlistdatatosend: any;
  itemaddingcart: Observable<boolean>;
  wishlistremoveloading: Observable<boolean>;
  wishlistremoveloaded: Observable<boolean>;
  wishlistremovefailure: Observable<boolean>;
  selectedProduct: Observable<any[]>;
  allProductData: Product[];
  @Output() cartItems: EventEmitter<any> = new EventEmitter();
  variantObject: any;
  varientSizeID: any;
  RecentlyView: boolean;
  logoutloader: boolean;
  overview: boolean = false;
  public userMobileUpdate = new BehaviorSubject("");
  public mobileUpdateResp = this.userMobileUpdate.asObservable();
  public otpResponseForMobile = new BehaviorSubject("");
  public otpResponse = this.otpResponseForMobile.asObservable();

  constructor(
    private store: Store<any>,
    private router: Router,
    public route: ActivatedRoute,
    private userService: UserService
  ) {
    this.route.queryParams.subscribe(param => {
      this.fragment = param["tab"];

      if (this.fragment === "orders") {
        this.OrderReturn();
      }
      if (this.fragment === "profile") {
        this.profile();
      }
      if (this.fragment === "addresses") {
        this.addaddress();
      }
      if (this.fragment === "wishlist") {
        this.wishlistclick();
      }
      // if (this.fragment === "cards") {
      //   this.savecardclick();
      // }
      if (this.fragment === "rewards") {
        this.rewardpointclick();
      }
      if (this.fragment === "newsletter") {
        this.newsletterclick();
      }
      if (this.fragment === "recentview") {
        this.recentclick();
      }      
      if (this.fragment === "overview") {
        this.overviewclick();
      }
    });
    this.fragment = this.route.snapshot.fragment;
    this.store.dispatch(new user.UserProfileDetail());
    this.userprofileInfo = this.store.select(fromUser.getuserprofile);
    this.userprofilesubmitfailure = this.store.select(
      fromUser.getuserprofilesubmitfailure
    );
    this.userprofilesubmitloading = this.store.select(
      fromUser.getuserprofilesubmitloading
    );
    this.userprofilesubmitloaded = this.store.select(
      fromUser.getuserprofilesubmitloaded
    );
    this.store.dispatch(new user.UserOrders());
    this.userorders = this.store.select(fromUser.getuserorder);
    this.userorderloading = this.store.select(fromUser.getuserorderloading);
    this.userorderloaded = this.store.select(fromUser.getuserorderloaded);
    this.store.dispatch(new user.GetUserAddress());
    this.allAddresses = this.store.select(fromUser.getuseraddress);
    this.alladdressloading = this.store.select(fromUser.getuseraddressloading);
    this.alladdressloaded = this.store.select(fromUser.getuseraddressloaded);
    this.useraddresssaveloading = this.store.select(
      fromUser.getuseraddresssaveloading
    );
    this.useraddresssaveloaded = this.store.select(
      fromUser.getuseraddresssaveloaded
    );
    this.useraddresssavefailure = this.store.select(
      fromUser.getuseraddresssavefailure
    );
    this.usereditaddresssaveloading = this.store.select(
      fromUser.getusereditaddresssaveloading
    );
    this.usereditaddresssaveloaded = this.store.select(
      fromUser.getusereditaddresssaveloaded
    );
    this.usereditaddresssavefailure = this.store.select(
      fromUser.getusereditaddresssavefailure
    );
    this.usercardsaveloading = this.store.select(
      fromUser.getusercardsaveloading
    );
    this.usercardsaveloaded = this.store.select(fromUser.getusercardsaveloaded);
    this.usercardsavefailure = this.store.select(
      fromUser.getusercardsavefailure
    );
    this.usercardeditloading = this.store.select(
      fromUser.getusercardeditloading
    );
    this.usercardeditloaded = this.store.select(fromUser.getusercardeditloaded);
    this.usercardeditfailure = this.store.select(
      fromUser.getusercardeditfailure
    );
    this.usercardnullloading = this.store.select(
      fromUser.getusercardnullloading
    );
    this.getusercardnullloaded = this.store.select(
      fromUser.getusercardnullloaded
    );
    this.getusercardnullfailure = this.store.select(
      fromUser.getusercardnullfailure
    );
    this.getusercardremoveloading = this.store.select(
      fromUser.getusercardremoveloading
    );
    this.getusercardremoveloaded = this.store.select(
      fromUser.getusercardremoveloaded
    );
    this.getusercardremovefailure = this.store.select(
      fromUser.getusercardremovefailure
    );
    this.useraddressremoveloading = this.store.select(
      fromUser.getuseraddressremoveloading
    );
    this.useraddressremoveloaded = this.store.select(
      fromUser.getuseraddressremoveloaded
    );
    this.useraddressremovefailure = this.store.select(
      fromUser.getuseraddressremovefailure
    );
    this.useraddressnullloading = this.store.select(
      fromUser.getuseraddressnullloading
    );
    this.useraddressnullloaded = this.store.select(
      fromUser.getuseraddressnullloaded
    );
    this.useraddressnullfailure = this.store.select(
      fromUser.getuseraddressnullfailure
    );
    this.store.dispatch(new product.UserWishlist());
    this.userwishlist = this.store.select(fromProduct.getuserwishlist);
    this.userwishlistloading = this.store.select(
      fromProduct.getuserwishlistloading
    );
    this.userwishlistloaded = this.store.select(
      fromProduct.getuserwishlistloaded
    );
    this.wishlistnullloading = this.store.select(
      fromProduct.getwishlistnullloading
    );
    this.wishlistnullloaded = this.store.select(
      fromProduct.getwishlistnullloaded
    );
    this.wishlistnullfailure = this.store.select(
      fromProduct.getwishlistnullfailure
    );
    this.wishlistremoveloading = this.store.select(
      fromProduct.getwishlistremoveloading
    );
    this.wishlistremoveloaded = this.store.select(
      fromProduct.getwishlistremoveloaded
    );
    this.wishlistremovefailure = this.store.select(
      fromProduct.getwishlistremovefailure
    );

    this.itemaddingcart = this.store.select(fromCart.getitemadding);

    this.store.dispatch(new user.GetUserAddress());
    this.store.select(fromUser.getuseraddress).subscribe(add => {
      this.useraddress = add;
      //console.log(this.useraddress);
    });
    this.store.dispatch(new user.UserCardDetail());
    this.store.select(fromUser.getusercarddetail).subscribe(cards => {
      this.usercards = cards;
    });
    this.allCards = this.store.select(fromUser.getusercarddetail);
    this.store.select(fromUser.getuseraddressnullloaded).subscribe(data => {
      if (data) {
        this.store.dispatch(new user.UserAddressRemove(this.carddatatosend));
      }
    });
    this.store.select(fromUser.getusercardnullloaded).subscribe(data => {
      if (data) {
        this.store.dispatch(
          new user.UserCardRemove(this.removedcarddatatosend)
        );
      }
    });
    this.store.select(fromProduct.getwishlistnullloaded).subscribe(data => {
      if (data) {
        this.store.dispatch(
          new product.WishlistRemove(this.removedwishlistdatatosend)
        );
      }
    });
  }

  ngOnInit() {
    if (this.userService.updateMobileResp) {
      this.userService.updateMobileResp.subscribe(response => {
        this.userMobileUpdate.next(response);
      });
    }
  }

  
  OrderReturn() {
    this.OrdersReturns = true;
    this.appProfile = false;
    this.addnewaddress = false;
    this.overview = false;
    this.rewardpoint = false;
    this.wishlist = false;
    this.newsletter = false;
    this.accountlinks = false;
    this.accountmain = true;
  }
  profile() {
    this.OrdersReturns = false;
    this.appProfile = true;
    this.addnewaddress = false;
    this.overview = false;
    this.rewardpoint = false;
    this.wishlist = false;
    this.newsletter = false;
    this.accountlinks = false;
    this.accountmain = true;
  }
  addaddress() {
    this.OrdersReturns = false;
    this.appProfile = false;
    this.overview = false;
    this.addnewaddress = true;
    this.rewardpoint = false;
    this.wishlist = false;
    this.newsletter = false;
    this.accountlinks = false;
    this.accountmain = true;
    console.log(this.overview);
  }
  overviewclick() {
    console.log("overviewclick")
    this.OrdersReturns = false;
    this.appProfile = false;
    this.addnewaddress = false;
    this.overview = true;
    console.log(this.overview);
    this.rewardpoint = false;
    this.wishlist = false;
    this.newsletter = false;
    this.accountlinks = false;
    this.accountmain = true;
  }
  rewardpointclick() {
    this.OrdersReturns = false;
    this.appProfile = false;
    this.addnewaddress = false;
    this.overview = false;
    this.rewardpoint = true;
    this.wishlist = false;
    this.newsletter = false;
    this.accountlinks = false;
    this.accountmain = true;
  }
  wishlistclick() {
    this.OrdersReturns = false;
    this.appProfile = false;
    this.addnewaddress = false;
    this.overview = false;
    this.rewardpoint = false;
    this.wishlist = true;
    this.newsletter = false;
    this.accountlinks = false;
    this.accountmain = true;
  }
  recentclick() {
    this.OrdersReturns = false;
    this.appProfile = false;
    this.addnewaddress = false;
    this.overview = false;
    this.rewardpoint = false;
    this.wishlist = false;
    this.newsletter = false;
    this.RecentlyView = true;
    this.accountlinks = false;
    this.accountmain = true;
  }
  newsletterclick() {
    this.OrdersReturns = false;
    this.appProfile = false;
    this.addnewaddress = false;
    this.overview = false;
    this.rewardpoint = false;
    this.wishlist = false;
    this.newsletter = true;
    this.accountlinks = false;
    this.accountmain = true;
  }

  back() {
    this.accountlinks = true;
    this.accountmain = false;
  }
  profileSubmit(data) {
    //console.log(data);
    this.store.dispatch(new user.UserProfileSubmit(data));
  }

  addressSubmit(data) {
    //console.log(data);
    this.store.dispatch(
      new user.UserAddressSave({ addresses: this.useraddress, newadd: data })
    );
  }

  editAddressSubmit(data) {
    //console.log(data);
    this.store.dispatch(new user.UserEditAddressSave(data));
  }

  cardSubmit(data) {
    //console.log(data);
    this.store.dispatch(
      new user.UserCardSave({ cards: this.usercards, newcard: data })
    );
  }

  editCardSubmit(data) {
    //console.log(data);
    this.store.dispatch(new user.UserCardEditSave(data));
  }

  removedAddressSubmit(data) {
    //console.log(data);
    this.carddatatosend = data;
    this.store.dispatch(new user.UserAddressNull());
  }

  removedCardData(data) {
    this.removedcarddatatosend = data;
    this.store.dispatch(new user.UserCardNull());
  }

  removedWishlistData(data) {
    //console.log(data);
    this.removedwishlistdatatosend = data;
    this.store.dispatch(new product.WishlistNull());
  }

  addToCart(data) {
    //console.log(data);
    this.store.dispatch(new cart.CartAddItem(data));
  }

  moveToCart(event) {
    this.store.dispatch(new product.SingleProductLoad(event));
    this.selectedProduct = this.store.select(fromProduct.getProductEntities);
    this.store.select(fromProduct.getProductEntities).subscribe(data => {
      if (data && data[0] && data[0].id) {
        //console.log(data);
        this.allProductData = data;
        this.variantObject = {
          product_id: this.allProductData[0].id,
          options: [{ id: this.allProductData[0].options[0]["id"] }]
        };
        //console.log(this.variantObject);
        //this.cartItems.emit(this.variantObject);
        // this.removewishlist(data2);
      }
    });
  }

  logout() {
    //console.log("logout");
    //this.dologout.emit();
    this.store.dispatch(new user.UserLogout());
    this.logoutloader = true;
    // this.loginuser = null;
    // location.reload();
  }
  selectedSizeWishlist(e) {
    //console.log(e);
    this.varientSizeID = e;
    if (this.varientSizeID && this.variantObject) {
      this.variantObject.options[0].value = this.varientSizeID;
      //console.log(this.variantObject);
      this.store.dispatch(new cart.CartAddItem(this.variantObject));
    }
  }

  /**
   * profileMobileUpdate
   */
  public profileMobileUpdate(data: any) {
    if (data) {
      this.userService.verifyMobileAndOTP(data);
    }
  }

  /**
   * @method generateOTPForMobile
   */
  public generateOTPForMobile(data: any) {
    this.userService.generateOTPForMobileUpdate(data).subscribe(
      response => {
        this.otpResponseForMobile.next(response);
        return response;
      },
      error => {
        this.otpResponseForMobile.next(error.error);
        return error.error;
      }
    );
  }
}
