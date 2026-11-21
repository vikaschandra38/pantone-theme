import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  SimpleChanges,
  ElementRef
} from "@angular/core";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { CookieService } from "ngx-cookie";
import { mobile, environment } from "@env/environment";
import _ from "lodash";
import { AnalyticsService } from "@app/shared/services/analytics.service";
import { ProductsService } from "@app/shared/services/products.service";
import { PlatformLocation } from '@angular/common';

@Component({
  selector: "app-product-listing",
  templateUrl: mobile
    ? "./product-listing.component.mobile.html"
    : "./product-listing.component.html",
  styleUrls: mobile
    ? ["./product-listing.component.mobile.css"]
    : ["./product-listing.component.css"],
    
})
export class ProductListingComponent implements OnInit {
  
  filtershow: boolean;
  @Input() children;
  @Input() products;
  @Input() prodlen;
  @Input() loaded;
  @Input() loading;
  @Input() loadedFilter;
  @Input() loadingFilter;
  @Input() loadedCat;
  @Input() categoryexists;
  @Input() loadingCat;
  @Input() facetslist;
  @Input() facetStats;
  @Input() getUpdatedFilter;
  @Input() filters;
  @Input() nbHits: any = 48;
  @Input() nbPages: any = 1;
  @Input() currentPage: any = 0;
  @Input() categoryEntity;
  @Input() categoryChildren;
  @Input() categoryId;
  @Input() moreloading;
  @Input() moreloaded;
  @Output() checkedObject: EventEmitter<any> = new EventEmitter();
  @Output() sortObject: EventEmitter<any> = new EventEmitter();
  @Output() load_more: EventEmitter<any> = new EventEmitter();
  @Output() retain: EventEmitter<any> = new EventEmitter();
  @Input() getuserwishlistloading;
  @Input() getuserwishlistloaded;
  @Input() getuserwishlist;
  @Output() wishlistData: EventEmitter<any> = new EventEmitter();
  @Output() openloginpopup: EventEmitter<any> = new EventEmitter();
  @Output() wishlistDataRemoveListing: EventEmitter<any> = new EventEmitter();
  @Input() getwishlistremoveloaded;
  @Input() getwishlistremoveloading;
  @Input() parentcategory;
  parentData;
  public loadingCount: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  sortValue = {
    ws_pantone_products: "Default",
    eshopbox_products_relevance: "Relevance",
    ws_pantone_products_price_asc: "Price Ascending",
    ws_pantone_products_price_dec: "Price Descending",
    ws_pantone_products_alphabet_asc: "Aa-Zz",
    ws_pantone_products_alphabet_dec: "Zz-Aa",
    ws_pantone_products_price_discount:"Discount"
  };
  selectedFilters;
  checkedFilters;
  sortIndex;
  facets;
  facStats;
  nbProducts;
  allQueryParams;
  minp: any;
  maxp: any;
  search: any;
  // showInWishlist1 = false;
  wishlistloginerror: boolean;
  variantsize: any;
  activesize: any;
  isSize: string;
  wishlistaddederror: boolean;
  checkProductId: any[];
  sortfilter: boolean;
  schema: any = {};
  tagArray: any;
  tagaarayval: string;

  tagValue: string = "Jack-Pack";
 
  stockOutProducts = [];
  ListingPageImageWidth = "?tr=w-350";
  MobileListingPageImageWidth = "?tr=w-400";
  ListingPageCategoryImageWidth = "?tr=w-1500";
  MobileListingPageCategoryImageWidth = "?tr=w-770";
  public index = 0;
  public lastViewedItem: any = 0;
  public direction: any = '';
  public throttle: any = 300;
  public scrollDistance: any = 1;
  public scrollUpDistance: any = 2;
  public config = { itemsPerPage: environment.hitsperpage, currentPage: 1, totalItems: 0 }
  public selectedPage: any = 0;

  constructor(
    private cookieService: CookieService,
    private analyticsService: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    public route: ActivatedRoute,
    private productsservice: ProductsService,
    @Inject(PLATFORM_ID) private platform: Object,
    private location: PlatformLocation,
    private elementRef: ElementRef
  ) {
    this.loading = true;
    this.loaded = false;
    this.allQueryParams = router.parseUrl(router.url).queryParams;
    this.config.currentPage = 1;
  }

  onUp(ev: any = null) {
    this.direction = 'up';
  }

  sortedArray() {
    this.children.sort((object1, object2) => {
      return object1.sort - object2.sort;
    });
    return true;
  }


  ngOnInit() {
    
    if (isPlatformBrowser(this.platformId)) {
      if (document.querySelector(".sorting-dropdown ul")) {
        document.querySelector(".sorting-dropdown ul").addEventListener(
          "click",
          (e: Event) => {
            let btn = document.querySelector(
              ".sorting-dropdown-btn .sorting-text"
            );
            btn.childNodes[0].nodeValue = (<HTMLInputElement>(
              e.srcElement
            )).innerHTML;
            this.sortBy((<HTMLInputElement>e.srcElement).id);
          },
          false
        );
      }
    }
    if (isPlatformServer(this.platformId)) {
    }
    this.router.events.subscribe((val: any) => {
      if (val && !localStorage.getItem('lastViewedItem')) {
        this.filters.page = 0;
        this.config.currentPage = this.filters.page + 1;
      }
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (localStorage.getItem("backstate")) {
      let backstate = JSON.parse(localStorage.getItem("backstate"));
      this.filters.page = backstate.page;
      this.config.currentPage = backstate.page + 1;
      this.selectedPage = backstate.page;
    }
    this.config.totalItems = this.nbHits;
    this.search = this.router.parseUrl(this.router.url).queryParams["search"];

    if (changes.hasOwnProperty("products") && this.products) {
      this.setSchemaForJSONLD();
      this.measureProductImpressions();
    }
    if(localStorage.getItem('lastViewedItem')) {
      this.scrollToLastViewed(this.products);
    }
  }

  // add tag function
  checkTagValue(product) {
    if (product && product.tags && product.tags.includes(this.tagValue)) {
      return true;
    }

    return false;
  }
  measureProductImpressions() {
    let products = [];
    if (this.products.length) {
      products = this.products.map(product => {
        return {
          name: product.name,
          id: product.id,
          price: product.price,
          brand: "Blackberry",
          category: product.attributes.category,
          variant: product.attributes.colour,
          quantity: 1
        };
      });
      const data = {
        event: "productView",
        ecommerce: {
          currencyCode: this.products[0].currency, // Local currency is optional.
          impressions: products
        }
      };
      this.analyticsService.pushToDataLayer(data);
    }
  }

  setSchemaForJSONLD() {
    let productSchemaArray = this.products.map(product => {
      let sizeArray = [];
      if (_.get(product, "options[0].values")) {
        sizeArray = product.options[0].values.map(size => {
          return { "@type": "Size", size: size.name };
        });
      }
      return {
        "@type": "Product",
        image: _.get(product, "images[0].file.url"),
        url: "",
        name: product.name,
        price: `INR ${this.makeprice(product.price)}`,
        offers: {
          "@type": "Offer",
          price: `INR ${this.makeprice(product.sale_price)}`
        },
        size: sizeArray
      };
    });
    this.schema = {
      "@context": "http://schema.org",
      "@type": "ProductList",
      url: "https://" + environment.site_url,
      numberOfItems: this.products ? this.products.length : 0,
      itemListElement: productSchemaArray
    };
  }

  checkOutOfStock(product) {
    if (product && product.options && product.options.length == 0) {
      if (product.stock_level > 0) {
        return false;
      } else {
        return true;
      }
    }

    if (product && product.options && product.options.length > 0) {
      if (
        product.in_stock_variant_size &&
        product.in_stock_variant_size.size &&
        product.in_stock_variant_size.size.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  checkItemOnWishlist(prodid) {
    if (this.getuserwishlist && this.getuserwishlist.length > 0) {
      return this.getuserwishlist.filter(
        el => el.wishlist_item.product_id === prodid
      ).length;
    } else {
      return 0;
    }
  }
  retainEvent(e) {
    let myarray = [];
    let indices = [];
    this.getUpdatedFilter[e.key].forEach(element => {
      e.value.forEach((elem, index) => {
        if (element.selected === true) {
          // elem.selected = true
          if (element.value === elem.value) {
            elem.selected = true;
            indices.push(index);
            // console.log(e.value);
          } else {
            // elem.selected = false;
          }
        }
      });
    });
    // console.log(indices);
    e.value.forEach((element, index) => {
      if (indices.length > 0) {
        indices.forEach((el, ind) => {
          if (el[ind] === index) {
            element.selected = true;
          } else {
            element.selected = false;
          }
        });
      } else {
        element.selected = false;
      }
    });
    indices.forEach((el, index) => {
      e.value[el].selected = true;
    });

    // console.log(this.getUpdatedFilter);
    // console.log(e);
    this.getUpdatedFilter[e.key] = e.value;
    // console.log(this.getUpdatedFilter);

    this.retain.emit(e);
    //console.log(e);
  }
  sortBy(val) {
    this.filters.sort = val;
    this.filters.page = 0;
    this.config.currentPage = this.filters.page + 1;
    this.checkedObject.emit(this.filters);
  }
  sortEvent(event) {
    this.filters.sort = event;
    this.filters.page = 0;
    this.config.currentPage = this.filters.page + 1;
    this.sortObject.emit(this.filters);
  }

  applyCheckedFilters(event) {
    this.checkedObject.emit(event);
    //this.filtershow = false;
  }

  loadMore(pageNumber: any) {
    if(this.config.currentPage == pageNumber) { return; };
    this.filters.category_id = this.filters.category_id && this.filters.category_id.category_id ? this.filters.category_id.category_id : this.filters.category_id;
    this.selectedPage = this.filters.page = pageNumber - 1;
    this.config.currentPage = this.filters.page + 1;
    this.load_more.emit(this.filters);
    if (this.products && this.products.length && !localStorage.getItem('lastViewedItem')) {
      let elmnt = this.elementRef.nativeElement.querySelector('#product0');
      if(elmnt) {
        elmnt.scrollIntoView({ block: "end", inline: "nearest"});
      }
    }
  }

  get currentFilter() {
    return this.filters.sort;
  }

  get productcount() {
    // {{ facetslist | json }} ============= {{ categoryEntity.id | json}}
    return this.facetslist["category_index.id"][this.categoryEntity.id];
  }

  clearSingleFilter(key, value) {
    if (key !== "Price Range") {
      // console.log(this.filters);
      let va = this.filters.filters.filter(dta => dta.key == key);
      // console.log(va);
      let c = va[0].data.filter(k => k != value);
      // console.log(c);
      // console.log(this.filters);
      va[0].data = c;
      this.checkedObject.emit(this.filters);
    }
    if (key === "Price Range") {
      // console.log(this.filters);
      let va = this.filters.price_range;
      this.filters.price_range = [];
      this.checkedObject.emit(this.filters);
    }
  }

  clearFilter() {
    this.filters.filters = [];
    this.filters.price_range = [];
    this.checkedObject.emit(this.filters);
  }
  get selectedFilterTag() {
    let result = [];
    // console.log(this.getUpdatedFilter);
    const data = Object.keys(this.getUpdatedFilter);
    data.forEach(element => {
      this.getUpdatedFilter[element].forEach(ele => {
        if (ele.selected) {
          result.push({ value: ele.value, key: element });
        }
      });
    });
    let filtersar;
    if (this.router.parseUrl(this.router.url).queryParams["filters"]) {
      filtersar = this.router
        .parseUrl(this.router.url)
        .queryParams["filters"].split("::");

      filtersar.forEach(element => {
        var subEl = element.split(":");
        if (subEl[0] === "min_price") {
          this.minp = JSON.parse(subEl[1]);
        }
        if (subEl[0] === "max_price") {
          this.maxp = JSON.parse(subEl[1]);
        }
      });
    }
    // if(this.minp && this.maxp) {
    //   result.push({key: 'Price Range', value: ('Rs. ' + this.minp + ' /- to Rs. ' + this.maxp + ' /-')})
    // }
    return result;
  }
  sort(array) {
    var preferredOrder = ["S", "M", "L", "XL", "XXL", "3XL"];
    array.sort((a, b) => {
      if (isNaN(a.size))
        return preferredOrder.indexOf(a.size) - preferredOrder.indexOf(b.size);
      else return a.size - b.size;
      
    });
    return true;
    
  }
  makeprice(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
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
  percentage(sale_price, price) {
    let results = 0;
    if (sale_price < price) {
      let diff = price - sale_price;
      results = Math.floor((diff / price) * 100);
    }
    return results;
  }

  // filter mobile
  closefilter(e) {
    console.log("click");
    this.filtershow = false;
  }
  clearFilterAll() {
    // console.log("adsfdsfsd");
    this.filtershow = false;
    this.filters.filters = [];
    this.checkedObject.emit(this.filters);
  }

  addToWishlist(product) {
    // console.log(product);
    //return false;
    if (isPlatformBrowser(this.platform)) {
      if (this.cookieService.get("loginuser")) {
        // console.log(this.getuserwishlist.length);

        if (this.getuserwishlist.length === 0) {
          // console.log("step 1 for empty wishlist");
          this.wishlistloginerror = false;
          let variantObjectWishlist = {
            product_id: product.id,
            product_info_slug: product.slug,
            product_image: product.images[0].file.url,
            product_name: product.name,
            product_color: product.attributes.color,
            product_currency: product.currency,
            product_sale_price: product.sale_price
          };
          // console.log(variantObjectWishlist);
          this.wishlistData.emit(variantObjectWishlist);
        }

        if (this.getuserwishlist.length > 0) {
          // console.log(this.getuserwishlist.length);
          // console.log("step 2");
          this.checkProductId = this.getuserwishlist.filter(
            el => el.wishlist_item.product_id === product.id
          );
          // console.log(this.checkProductId);
          if (this.checkProductId.length > 0) {
            this.newWishlistArray = this.getuserwishlist.filter(
              wishlist => wishlist.wishlist_item.product_id !== product.id
            );
            // console.log(this.newWishlistArray);
            // console.log("step 3");
            //alert("Already Added");
            this.checkProductId = [];
            this.wishlistDataRemoveListing.emit(this.newWishlistArray);
          } else {
            // console.log("step 4");
            let variantObjectWishlist = {
              product_id: product.id,
              product_info_slug: product.slug,
              product_image: product.images[0].file.url,
              product_name: product.name,
              product_color: product.attributes.color,
              product_currency: product.currency,
              product_sale_price: product.sale_price
            };
            // console.log(variantObjectWishlist);
            this.wishlistData.emit(variantObjectWishlist);
            this.checkProductId = [];
          }
        }
      } else {
        this.wishlistloginerror = true;
        this.openloginpopup.emit(true);
        setTimeout(() => {
          this.wishlistloginerror = false;
        }, 4000);
      }
    }
    if (isPlatformServer(this.platform)) {
    }
  }
  newWishlistArray(newWishlistArray: any): any {
    throw new Error("Method not implemented.");
  }
  addedInWishlist() {
    this.wishlistaddederror = true;
    setTimeout(() => {
      this.wishlistaddederror = false;
    }, 2000);
  }

  sortclick() {
    this.sortfilter = !this.sortfilter;
  }
  measureProductClicks(product, index:any = 0) {
    const data = {
      event: "productClick",
      ecommerce: {
        click: {
          actionField: { list: "Search Results" },
          products: [
            {
              name: product.name, // Name or ID is required.
              id: product.id,
              price: product.price,

              category: product.attributes.category,
              variant: product.attributes.colour,
              // 'position': this.prodDetails[0].position,
              brand: "Blackberrys"
            }
          ]
        }
      }
    };
      let backstate: any = {
        'length': this.products.length,
        'index': index,
        'page' : this.selectedPage
      }
      localStorage.setItem('backstate', JSON.stringify(backstate));
    this.analyticsService.pushToDataLayer(data);
  }


  selectedurl(urlCheck) {
    if (this.router.url.indexOf("suits-blazers") > -1) {
      return false;
    }
    if (this.router.url.indexOf(urlCheck) > -1) {
      return true;
    }
    return false;
  }

  checkCategoryLoaded(categoryId) {
    var filterOption;
    console.log("checkCategoryLoaded", categoryId);
    filterOption = sessionStorage.getItem("filterOptions");
    if (!filterOption) return true;
    else {
      filterOption = JSON.parse(filterOption);
      if (!(categoryId in filterOption)) {
        return false;
      } else return true;
    }
  }

  /**
   * @method checkForBackState
   */
  public checkForBackState() {
    this.location.onPopState(() => {
      if(localStorage.getItem('backstate')) {
        localStorage.setItem('isBackClicked', 'true');
      };
      let backstate = JSON.parse(localStorage.getItem('backstate'));
      if (backstate && backstate.index) {
        localStorage.setItem('lastViewedItem', backstate.index);
      }
      this.filters.page = 0;
    });
  }

  ngAfterViewChecked() {
    // if(mobile) {
      this.checkForBackState();
    // }
  }

/**
   * @method scrollToLastViewed
   */
  public scrollToLastViewed(products:any = null) {
    this.lastViewedItem = localStorage.getItem('lastViewedItem');
    if(products && products.length >= Number(Number(this.lastViewedItem).toFixed())) {
      this.lastViewedItem = localStorage.getItem('lastViewedItem');
      setTimeout(() => {
        let elmnt = document.getElementById(`product${this.lastViewedItem}`);
        if(elmnt) {
          elmnt.scrollIntoView({ block: "end", inline: "nearest"});
          localStorage.removeItem('lastViewedItem');
          localStorage.removeItem("isBackClicked");
          localStorage.removeItem("backstate");
        }
      }, 1);
    }
  }

}
