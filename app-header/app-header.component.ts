import { Product } from "@app/products/models/product.model";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Inject,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";

import { mobile } from "@env/environment";
import { PLATFORM_ID } from "@angular/core";
import * as product from "@app/products/actions/products.actions";
import { Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { AppState } from "@app/reducers";
import { OtpProcessService } from '@app/otp/otp-process.service';

@Component({
  selector: "app-header",
  templateUrl: mobile
    ? "./app-header.component.mobile.html"
    : "./app-header.component.html",
  styleUrls: mobile
    ? ["./app-header.component.mobile.css"]
    : ["./app-header.component.css"]
})
export class HeaderComponent implements OnChanges {
  @ViewChild("search", { static: false }) searchElement: ElementRef;
  showsearch: boolean = false;
  searchDropdown = false;
  isSearchPopup: boolean = false;
  loginuser;
  search;
  @Input() headerContent: any;
  @Input() filters: any;
  @Input() isLoading: any;
  @Input() isLoaded: any;
  @Input() isSearchLoading: boolean;
  @Input() isSearchLoaded: boolean;
  @Input() loginloaded;
  @Input() loginloading;
  @Input() logoutLoading;
  @Input() logoutLoaded;
  @Input() loginfailure;
  @Input() signupinit;
  @Input() signupsuccess;
  @Input() signupfailure;
  @Input() isUser;
  @Input() logoutStatus;
  @Input() SearchProduct: Product[];
  @Input() cartdetails: any;
  @Input() SearchFacets: any[];
  @Input() userforgotloading;
  @Input() userforgotloaded;
  @Input() userforgotfailed;
  @Output() applySearch: EventEmitter<any> = new EventEmitter();
  @Output() applyProductSearch: EventEmitter<any> = new EventEmitter();
  @Output() cartEvent: EventEmitter<any> = new EventEmitter();
  @Output() dologout: EventEmitter<any> = new EventEmitter();
  @Output() logindata: EventEmitter<any> = new EventEmitter();
  @Output() signupdata: EventEmitter<any> = new EventEmitter();
  @Output() loginfailureEvent: EventEmitter<any> = new EventEmitter();
  @Output() signupformInvalidEvent: EventEmitter<any> = new EventEmitter();
  @Output() forgotData: EventEmitter<any> = new EventEmitter();
  @Output() resetvalues: EventEmitter<any> = new EventEmitter();
  @Output() userinfo: EventEmitter<any> = new EventEmitter();
  @Output() closeForgotPopup: EventEmitter<any> = new EventEmitter();
  @Output() openloginpopup: EventEmitter<any> = new EventEmitter();
  @Output() getcartlist: EventEmitter<any> = new EventEmitter();
  @Input() loginname;
  @Input() wishl;
  @Input() showforget;
  @Output() socialsignupdata: EventEmitter<any> = new EventEmitter();
  @Input() socialloginloading;
  @Input() socialloginloaded;
  @Input() socialloginfailed;
  @Input() wishlistloginpopup;
  @Input() getforgotpasswordloaded;
  @Input() cartforgotpopup;

  forgetpassword = false;
  loginSignUpPopup = false;
  overlaypupup = false;
  sendmail = false;
  sendmailhide = true;
  searchText;

  main_headers = {
    menuItemText: [],
    redirectLink: []
  };
  menu_icons = {
    iconLink: [],
    altText: [],
    redirectLink: []
  };
  subMenuVisible = false;
  subCategories: any[] = [];
  hoveredItem: string;
  haveSubCategories: any[] = [];
  selectedMenu;
  loginpopup;
  signuppopup;
  cartItemCount = 0;
  openmenustatus = false;
  allfield: boolean;
  signupemailinvalid: boolean;
  signupfirstnameinvalid: boolean;
  signuppassinvalid: boolean;
  wishlength: any;
  isSticky: boolean = false;
  showsearchlish: boolean;
  submenudisplay: boolean;
  signdropdown: any;
  currentindex: any;
  public showRegisterMobile: boolean = false;
  public timeoutpopup: boolean = false;
  blackfirday: boolean = false;
  shownavbar:boolean = false;

  constructor(
    public router: Router,
    private contentService: ContentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public store: Store<AppState>,
    private cookieService: CookieService,
    private otpProcessService: OtpProcessService
  ) //private socialAuthService: AuthService
  {}

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 10;
  }

  mouseon() {
    this.openmenustatus = true;
  }
  mouseout() {
    this.openmenustatus = false;
  }
  closemenu() {
    this.openmenustatus = false;
  }

  mouseonsubmenu() {
    this.submenudisplay = true;
  }
  mouseoutsubmenu() {
    this.submenudisplay = false;
  }

  // showsubmemu(event) {
  //   const el = event.currentTarget;
  //   el.classList.toggle("minusiconchange");
  //   console.dir(el.nextSibling);
  //   if (el.nextSibling.style.display === "block") {
  //     el.nextSibling.style.display = "none";
  //   } else {
  //     el.nextSibling.style.display = "block";
  //   }
  // }

  showsubmemu(i){
    if(this.currentindex === i){
      this.currentindex = null;
    }else{
    this.currentindex = i;
    // this.branchoffice = !this.branchoffice;
    }
  }
  showSearchclick(): void {
    this.isSearchPopup = false;
    this.searchText = "";
    this.showsearch = !this.showsearch;
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      if(this.searchElement && this.searchElement.nativeElement) {
        this.searchElement.nativeElement.focus();
      }
    }, 0);
  }

  ngOnChanges() {
    let session:any = localStorage.getItem('sessionTimeout');
    if (session) {
      session = JSON.parse(session);
      this.timeoutpopup = session == true ? true : false;
    } else {
      this.timeoutpopup = false;
    }
    if (this.wishlistloginpopup) {
      this.loginSignUpPopup = this.wishlistloginpopup;
      this.loginpopup = this.wishlistloginpopup;
      this.overlaypupup = this.wishlistloginpopup;
      this.signuppopup = !this.wishlistloginpopup;
      this.sendmailhide = this.wishlistloginpopup;
      this.sendmail = !this.wishlistloginpopup;
    }
    if (this.cartforgotpopup) {
      this.loginSignUpPopup = !this.cartforgotpopup;
      this.forgetpassword = this.cartforgotpopup;
      this.overlaypupup = this.cartforgotpopup;
      this.signuppopup = !this.cartforgotpopup;
      this.sendmailhide = !this.cartforgotpopup;
      this.sendmail = !this.cartforgotpopup;
    }
    //  console.log(this.wishl);
    if (this.isUser && this.isUser.email) {
      // this.cookieService.set('loginuser', this.isUser.email);
      this.closePopup();
      this.logoutStatus = false;
    }
    if (this.cookieService.get("loginuser")) {
      this.loginuser = this.cookieService.get("loginuser");
      // console.log(this.loginuser);
    }
    // console.log(this.logoutStatus);
    if (this.logoutStatus) {
      this.loginuser = null;
      this.cookieService.remove("loginuser");
      this.logoutStatus = false;
    }

    if (this.wishl && this.wishl.length > 0) {
      this.wishlength = this.wishl.length;
    }
    if (this.showforget) {
      this.showforgot();
    }
    if (this.loginloaded || this.signupsuccess) {
      // update user info after login
      this.userinfo.emit();
    }
    if (localStorage.getItem('signup1') && localStorage.getItem('signup')) {
      if (localStorage.getItem('signup1') == 'in process' && localStorage.getItem('signup') == 'success') {
        this.blackfirday = true;
        localStorage.removeItem('signup1');
        localStorage.removeItem('signup');
      }
    }
    this.cartItemCount = 0;
    // console.log(this.cartdetails);
    if (this.cartdetails && this.cartdetails.items) {
      this.cartdetails.items.forEach(item => {
        if (item) {
          this.cartItemCount = this.cartItemCount + item.quantity;
          // console.log("cartItemCount",this.cartItemCount);
        }
      });
    }

    // if (Object.keys(this.headerContent).length !== 0) {
    //   let content = this.contentService.extractHeaderItems(this.headerContent);
    //   this.main_headers = content.main_headers;
    //   this.menu_icons = content.menu_icons;
    //   let subCat = this.contentService.extractSubCategories(this.headerContent);
    //   this.haveSubCategories = subCat.haveSubCategories;
    //   this.subCategories = subCat.subCategories;
    // }

    if (
      this.router.parseUrl(this.router.url).queryParams["search"] != undefined
    ) {
      //this.searchText = this.router.parseUrl(this.router.url).queryParams['search'];
    }
  }

  onLoginFailure() {
    this.loginfailureEvent.emit();
  }
  onInvalidSignup() {
    this.signupformInvalidEvent.emit();
  }

  onUserInfoChange() {
    this.userinfo.emit();
  }
  onResetValues(value) {
    this.resetvalues.emit(value);
  }
  menuEntered($event) {
    this.selectedMenu = $event.target.innerText;
    $event.target.classList.add("active");
  }

  logout() {
    localStorage.removeItem('sessionTimeout');
    this.dologout.emit();
  }
  onLoginformCapturedValues(value) {
    this.logindata.emit(value);
  }
  onSignupformCapturedValues(value) {
    this.signupdata.emit(value);
  }
  menuRemoved($event) {
    this.selectedMenu = null;
    $event.target.classList.remove("active");
  }
  menuLeft() {}
  getSearch(search_text, event) {
    if (event.keyCode != 13) {
      this.searchText = search_text;
      this.search = search_text;
      if (search_text.length > 2) {
        this.isSearchPopup = true;
        this.applySearch.emit(search_text);
      } else {
        this.isSearchPopup = false;
        this.applySearch.emit(search_text);
      }
    } else {
      this.getProductSearch(search_text);
    }
  }
  getProductSearch(search_text) {
    this.isSearchPopup = false;
    this.showsearch = false;
    this.searchText = search_text;
    this.router.navigate(["/categories/all-styles"], {
      queryParams: { search: search_text }
    });

    this.applyProductSearch.emit(search_text);
    //location.reload();
    this.showsearchlish = !this.showsearchlish;
  }
  cartClicked() {
    this.cartEvent.emit();
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('popup-hidden');
    this.getcartlist.emit(event);
  }

  toggledropdown() {
    this.showsearchlish = !this.showsearchlish;
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      if(this.searchElement && this.searchElement.nativeElement) {
        this.searchElement.nativeElement.focus();
      }
    }, 0);
  }
  get convertMenu() {
    let results = [];
    if (this.subCategories && this.subCategories.length > 0) {
      this.subCategories.forEach(data => {
        let subCategory = {};
        if (data.menuSubcategory && data.menuSubcategory.length > 0) {
          data.menuSubcategory.forEach(element => {
            const subMenu = element.fields;
            if (subCategory[subMenu.columnNumber] == undefined) {
              subCategory[subMenu.columnNumber] = [];
            }
            subCategory[subMenu.columnNumber].push({
              key: subMenu["subcategoryTitle"],
              link: subMenu["redirectLink"],
              columnNumber: subMenu["columnNumber"],
              rowNumber: subMenu["rowNumber"],
              parent: subMenu["subMenuOf"]
            });
          });
        }
        results.push({
          key: data["menuItemText"],
          link: data["redirectLink"],
          haveSubcategories: data["haveSubcategories"],
          isIcon: data["isIcon"],
          subCategory: subCategory
        });
      });
    }
    return results;
  }
  getConvertedMenu(data, keys) {
    return data.filter(res => res.key === keys)[0];
  }
  loginPopupOpen() {
    this.loginSignUpPopup = true;
    this.loginpopup = true;
    this.signuppopup = false;
    this.overlaypupup = true;
    this.forgetpassword = false;
    this.sendmailhide = true;
    this.sendmail = false;
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('popup-hidden');
  }
  togglenav(){
  this.shownavbar = !this.shownavbar;
  const body = document.getElementsByTagName('body')[0];
  body.classList.add('popup-hidden');
  }
  closetoggle(){
    this.shownavbar = !this.shownavbar;
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('popup-hidden');
  }
  forgetclick() {
    this.loginSignUpPopup = false;
    this.loginpopup = false;
    this.signuppopup = false;
    this.forgetpassword = true;
    this.overlaypupup = true;
  }
  signupPopupOpen() {
    this.loginSignUpPopup = true;
    this.loginpopup = false;
    this.signuppopup = true;
    this.overlaypupup = true;
    this.closeForgotPopup.emit();
    this.openloginpopup.emit();
  }
  closePopup() {
    this.loginSignUpPopup = false;
    this.forgetpassword = false;
    this.overlaypupup = false;
    this.closeForgotPopup.emit();
    this.openloginpopup.emit();
    this.store.dispatch(new product.WishlistCloseSignInPopUp());
  }

  closeforget() {
    this.loginSignUpPopup = false;
    this.forgetpassword = false;
    this.overlaypupup = false;
    this.closeForgotPopup.emit();
  }

  showforgot() {
    this.forgetpassword = false;
  }

  get tagNames() {
    var results = [];
    this.SearchProduct.forEach((data: any, index) => {
      if(data.stock_status == "out_of_stock") {
        this.SearchProduct.splice(index, 1);
      }
      if(!data) { return; }
      if (data && data.name) {
        results.push(data.name);

        if (data && data["category"] && data["category"].length > 0) {
          data["category"].forEach(element => {
            if (
              element &&
              element.hasOwnProperty("name") &&
              element.name != null
            ) {
              results.push(element.name);
            }
          });
        }
        if (data && data["attributes"]) {
          var cc = Object.keys(data["attributes"]);
          cc.forEach(element => {
            if (
              results.indexOf(data["attributes"][element]) == -1 &&
              element !== "size_guide" &&
              element !== "0"
            ) {
              results.push(data["attributes"][element]);
            }
          });
        }
      }
    });

    var unique = results.filter(function(a) {
      return !this[a] && (this[a] = true);
    }, Object.create(null));
    return unique.filter(data => {
      if (typeof data === "string") {
        return data.toLowerCase().indexOf(this.search.toLowerCase()) == 0;
      }
    });
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value.toLowerCase()) === index;
  }
  categoryName(data) {
    var all = {};
    data.forEach(function(data) {
      all[data.sort] = data;
    });
    if (all[1] && all[2] && all[1].id && all[2].id) {
      var first = { id: all[1].id ? all[1].id : "", name: all[1].name };
      var second = { id: all[2].id ? all[1].id : "", name: all[2].name };
      return (first ? first.name : "") + " " + (second ? second.name : "");
    } else {
      return "";
    }
  }
  makeprice(x) {
    if (x) {
      x = x.toString();
    }

    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
  }

  openSearchPopup(search_text) {
    if (search_text.length > 2) {
      this.isSearchPopup = true;
    }
  }
  closeSearchPopup() {
    this.isSearchPopup = false;
    this.searchText = "";
    this.SearchProduct = [];
    this.showsearchlish = false;
  }

  color: string = "red";

  changeStyle($event) {
    this.color = $event.type == "mouseover" ? "yellow" : "red";
  }
  closesearchbox() {
    this.isSearchPopup = false;
    this.showsearch = false;
    this.searchText = "";
  }

  signinclick() {
    this.signdropdown = !this.signdropdown;
  }

  ngOnInit() {
    //console.log("logout status",this.logoutStatus);
    // this.contentSerive.getDukeHeaderData().subscribe(
    //   (content) => {
    //       this.DukeheaderContent = content;
        console.log('headerContent',this.headerContent)
    //       // this.title.setTitle('FAQs | DukeIndia')
    //   }
    // )
    this.router.events.subscribe(() => {
      this.showsearch = false;
      this.isSearchPopup = false;
      this.searchText = "";
    });
    this.subscribeResponse();
  }

  onSocialSignUp(userData) {
    this.socialsignupdata.emit(userData);
  }

  showsearchbarclick() {
    this.showsearchlish = !this.showsearchlish;
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      if(this.searchElement && this.searchElement.nativeElement) {
        this.searchElement.nativeElement.focus();
      }
    }, 0);
  }
  closeshowsearchbarclick() {
    this.showsearchlish = !this.showsearchlish;
    this.isSearchPopup = false;
    this.searchText = "";
    this.SearchProduct = [];
  }

  /**
   * @method subscribeResponse
   */
  public subscribeResponse() {
    if(this.otpProcessService && this.otpProcessService.loginRespObs) {
      this.otpProcessService.loginRespObs.subscribe((response: any) => {
        if(response && response.email) {
          this.loginuser = this.cookieService.get("loginuser");
          if (this.cookieService.get("userMobile") == 'false' && this.loginuser) {
            this.showRegisterMobile = true;
          } else {
            this.showRegisterMobile = false;
          }
          this.loginloaded = true;
          this.userinfo.emit();
        }
      })
    }
    if (this.cookieService.get("userMobile") == 'false' && this.loginuser) {
      this.showRegisterMobile = true;
    } else {
      this.showRegisterMobile = false;
    }
  }

  closefirday(){
    this.signupsuccess = false;
    this.blackfirday = false
  }

  percentage(sale_price, price) {
    let results = 0;
    if (sale_price < price) {
      let diff = price - sale_price;
      results = Math.floor((diff / price) * 100);
    }
    return results;
  }
  
}
