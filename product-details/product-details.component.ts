import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  SimpleChanges,
  HostListener
} from "@angular/core";
import { CookieService } from "ngx-cookie";
import { ActivatedRoute, Router } from "@angular/router";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";
import { mobile } from "@env/environment";
import _ from "lodash";

import { AnalyticsService } from "@app/shared/services/analytics.service";
import { SEOService } from '@app/shared/services/seo-service';
import { ProductsService } from '@app/shared/services/products.service';
import { object } from 'firebase-functions/lib/providers/storage';
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: "app-product-details",
  templateUrl: mobile
    ? "./product-details.component.mobile.html"
    : "./product-details.component.html",
  styleUrls: mobile
    ? ["./product-details.component.mobile.css"]
    : ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input("prodDetails") prodDetails;
  @Input() loading;
  @Input() loaded;
  @Input() recommendedProducts;
  @Input() getProductVarientEntities;
  @Output() cartItems: EventEmitter<any> = new EventEmitter();
  @Output() addItemGtm: EventEmitter<any> = new EventEmitter();
  @Input() contentfuldetails;
  @Input() itemaddingcart;
  @Input() getuserwishlistloading;
  @Input() getuserwishlistloaded;
  @Input() getuserwishlist;
  @Input() schemaData;
  @Input() getwishlistremoveloaded;
  @Input() getwishlistremoveloading;
  schema = {};
  @Input() itemAdded: boolean = false;
  counter = 0;
  sizeguidepopupblock;
  variantsize;
  variantcolour;
  active;
  activesize;
  slider = [];
  totalSlides = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  last = 1;
  last4 = 7;
  first = 0;
  isSize = "found";
  recentlyViewed = [];
  breadcrumbid: string;
  slider4: any[];
  sizeguide;
  sizeoverlay: boolean;
  wishlistloginerror: boolean;
  @Output() wishlistData: EventEmitter<any> = new EventEmitter();
  @Output() openloginpopup: EventEmitter<any> = new EventEmitter();
  showInWishlist1 = false;
  proimagepopup = false;
  sizeguideoverlay = false;
  wishlistaddederror: boolean;
  outofstockerror: boolean;
  newWishlistArray: any;
  currentIndex = 0;
  @Output() wishlistDataRemove: EventEmitter<any> = new EventEmitter();
  info: boolean = false;
  moredetails: boolean;

  sliderfullimage: any[];
  sliderimage: any[];
  image1: any;
  image2: any;
  availablesizes: any;

  detailMainImageWidth = "?tr=w-500";
  detailChildImageWidth = "?tr=w-300";
  detailZoomImageWidth = "?tr=w-950";
  mobiledetailMainImageWidth = "?tr=w-770";
  fragment: string;
  public isSalePopup: boolean = false;
  public popupProduct: string = '';
  public productOnPause: any;
  public comboProduct: any;
  variantprice: Object;
  variantsPrice: any;
  variantsName: any;
  productVariantsdata: any;
  public detailSalePrice: any;
  public detailPrice : any;

  constructor(
    private seoService: SEOService,
    public router: Router,
    private cookieService: CookieService,
    private analyticsService: AnalyticsService,
    public route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platform: Object,
    private ProductsService: ProductsService,
  ) {

    
    this.route.queryParams.subscribe(param => {
      // console.log(param['category']);
      this.fragment = param["category"];
      if (this.fragment === "all") {
      }
      if (this.fragment === "masks") {
      }
   
    });

    

    this.fragment = this.route.snapshot.fragment;

    if (isPlatformBrowser(this.platform)) {
      this.breadcrumbid = localStorage.getItem("breadcrumbid");
    }
    if (isPlatformServer(this.platform)) {
    }

    this.route.params.subscribe(param => {
      this.last = 1;
      this.last4 = 9;
      this.first = 0;
    });
    this.router.events
      //.pipe(filter(e => e instanceof NavigationStart))
      .subscribe(e => {
        const navigation = this.router.getCurrentNavigation();
      });
  }

  // sort(array) {
  //   if (typeof(array.name == 'number')){
  //     this.sortSizeByNumber(array);
  //   }else if (typeof(array.name == 'string')){
  //     this.sortSizeByName(array);
  //   }
  // }
  onSwipe(evt) {
    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? this.prev() : this.next()):'';
}

  sort(array) {
    var preferredOrder = ["S", "M", "L", "XL", "XXL", "3XL"];
    array.sort((a, b) => {
      if (isNaN(a.name))
        return preferredOrder.indexOf(a.name) - preferredOrder.indexOf(b.name);
      else return a.name - b.name;
    });
    return true;
  }
  makeprice(x) {
    if (x) {
      x = x.toString();
    }

    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
  }
  // sortSizeByName(array) {
  //   var preferredOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  //   array.sort(function (a, b) {
  //     return preferredOrder.indexOf(a.name) - preferredOrder.indexOf(b.name);
  //   });
  //   return array;
  // }

  ngOnInit() {
    
    // console.log("prodDetailsprodDetailsprodDetails",this.prodDetails);
    // this.ProductsService.getCategoryInfo(this.categorySlug).subscribe(res => {
    //   let x = res;
      // if(this.prodDetails.length == 0){
      //   this.router.navigate(['not-found']);
      //   this.seoService.PrerenderStatusCode();
      // }else{
      //   // console.log("else ---------- ");
      // }
      
    // });
    this.router.events.subscribe(() => {
      // this.isSize = "notfound";
      this.activesize = "";
    });
  }
  ngOnDestroy() {
    if (isPlatformBrowser(this.platform)) {
      localStorage.removeItem("breadcrumbid");
    }
    if (isPlatformServer(this.platform)) {
    }
    this.isSize = "notfound";
  }
  // makeprice(x) {
  //   x = x.toString();
  //   var pattern = /(-?\d+)(\d{3})/;
  //   while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  //   return x;
  // }
  nextSlider() {
    this.last++;
    this.first++;
    this.slider = this.imageInarray.slice(this.first, this.last);
    this.sliderfullimage = this.fullimageInarray.slice(this.first, this.last);
  }
  prevSlider() {
    this.last--;
    this.first--;
    this.slider = this.imageInarray.slice(this.first, this.last);
    this.sliderfullimage = this.fullimageInarray.slice(this.first, this.last);
  }
  slideclick(i) {
    this.currentIndex = i;
    this.image1 = this.sliderimage[this.currentIndex];
    this.image2 = this.sliderfullimage[this.currentIndex];
  }
  zoomSlideClick(i) {
    this.currentIndex = i;
    this.proimagepopup = true;
    this.image1 = this.sliderimage[this.currentIndex];
    this.image2 = this.sliderfullimage[this.currentIndex];
  }
  zoomclick(i: any) {
    this.currentIndex = i;
    // console.log('current index' + i);
    this.proimagepopup = true;
    this.image1 = this.sliderimage[this.currentIndex];
    // this.image1 = this.selectSideImage(i);
    this.image2 = this.sliderfullimage[this.currentIndex];
  }
  prev() {
    // console.log(this.image1, "SLIDER Prew");
    if (this.currentIndex === 0) {
      this.currentIndex = this.sliderimage.length - 1;
      this.image1 = this.sliderimage[this.currentIndex];
      this.image2 = this.sliderfullimage[this.currentIndex];
    } else {
      this.currentIndex = this.currentIndex - 1;
      this.image1 = this.sliderimage[this.currentIndex];
      this.image2 = this.sliderfullimage[this.currentIndex];
    }
  }
  next() {
    if (this.currentIndex === this.sliderimage.length - 1) {
      this.currentIndex = 0;
      this.image1 = this.sliderimage[this.currentIndex];
      this.image2 = this.sliderfullimage[this.currentIndex];
    } else {
      this.currentIndex = this.currentIndex + 1;
      this.image1 = this.sliderimage[this.currentIndex];
      this.image2 = this.sliderfullimage[this.currentIndex];
    }
    // console.log(this.image1, "SLIDER Next", this.currentIndex);
  }

  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.next();
      // console.log("right arrow");
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.prev();
      // console.log("left arrow");
    }
  }

  checksize(size) {
    if (this.availablesizes.includes(size)) {
      return false;
    } else {
      return true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentIndex=0;
    if(this.prodDetails && this.prodDetails[0] && this.prodDetails[0].sale_price){
      this.detailSalePrice = this.prodDetails[0].sale_price;
    }
    if(this.prodDetails && this.prodDetails[0] && this.prodDetails[0].price){
      this.detailPrice = this.prodDetails[0].price;
    }
    // console.log("detailsprice",this.detailSalePrice);
    

    if (this.prodDetails && this.prodDetails[0]){      
    const body = {'product_id': this.prodDetails[0].objectID}
    this.ProductsService.variantsproduct(body).subscribe((res:any) => {      
      if(res && res.variants && res.variants.results){
        // console.log("res",res.variants.results);  
        this.productVariantsdata = res.variants.results;  
      }
      // this.variantsPrice =  res.variants.results.map(
      //   el => el.sale_price,        
      // );
      // this.variantsName =  res.variants.results.map(        
      //   el => el.name
      // );
      // console.log("variantsPrice",this.variantsPrice , this.variantsName)
    })
  }
    // console.log("prodDetailsprodDetailsprodDetails",this.prodDetails[0].sale_price);
    if (this.itemAdded) {
      this.activesize = undefined;
      // this.isSize = 'notfound';
      this.variantsize = undefined;
    } //  reset product variantsize
    
    if (this.prodDetails && this.prodDetails[0])
      this.availablesizes = this.prodDetails[0].in_stock_variant_size.size.map(
        el => el.size
      );

    if (isPlatformBrowser(this.platform)) {
      var recnt_viewed = JSON.parse(localStorage.getItem("recent_viewed"));
      if (recnt_viewed) {
        this.recentlyViewed = recnt_viewed;
      }
    }
    if (isPlatformServer(this.platform)) {
    }

    var p_id;
    var showInWishlist = "no";
    this.slider = this.imageInarray.slice(this.first, this.last);
    this.slider4 = this.imageInarray.slice(this.first, this.last4);
    this.sliderfullimage = this.fullimageInarray;
    this.sliderimage = this.imageInarray;
    // console.log(this.recommendedProducts);
    if (
      this.recommendedProducts &&
      this.prodDetails &&
      this.prodDetails[0] &&
      this.prodDetails[0].slug
    ) {
      this.recommendedProducts = this.recommendedProducts.filter(
        prod => prod.slug !== this.prodDetails[0].slug
      );
    }
    this.prodDetails.forEach(function (value) {
      p_id = value.id;
    });
    // console.log(this.getuserwishlist);
    if (this.getuserwishlist != null) {
      this.getuserwishlist.forEach(function (value) {
        if (p_id == value.wishlist_item.product_id) {
          showInWishlist = "yes";
        }
      });
    }

    // console.log(showInWishlist);

    if (showInWishlist === "yes") {
      this.showInWishlist1 = true;
    }

    if (showInWishlist === "no") {
      this.showInWishlist1 = false;
    }
    if (this.prodDetails.length > 0) {
      this.schema = this.schemaData;
    }

    if (changes.hasOwnProperty("cart")) {
    }
  }

  measureProductDetails() {
    const data = {
      event: "productDetailClick",
      ecommerce: {
        detail: {
          products: [
            {
              name: this.prodDetails[0].name, // Name or ID is required.
              id: this.prodDetails[0].id,
              price: this.prodDetails[0].price,
              category: this.prodDetails[0].attributes.category,
              variant: this.prodDetails[0].attributes.colour,
              brand: "Pantone"
            }
          ]
        }
      }
    };
    this.analyticsService.pushToDataLayer(data);
  }
  setSchemaForJSONLD() {
    let sizeArray = [];
    if (_.get(this.prodDetails[0], "options[0].values")) {
      sizeArray = this.prodDetails[0].options[0].values.map(size => {
        return { "@type": "Size", size: size.name };
      });
    }

    if (this.prodDetails[0]) {
      this.schema = {
        "@context": "http://schema.org/",
        "@type": "Product",
        name: this.prodDetails[0].name,
        image: _.get(this.prodDetails[0], "images[0].file.url"),
        description: this.prodDetails[0].description,
        color: _.get(this.prodDetails[0], "attributes.colour"),
        sellingParty: _.get(this.prodDetails[0], "attributes.sold_by"),
        size: {
          "@type": "size",
          size: sizeArray
        },
        price: {
          "@type": "price",
          price: this.makeprice(this.prodDetails[0].sale_price)
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: this.makeprice(this.prodDetails[0].sale_price)
        }
        // aggregateRating: {
        //   "@type": "AggregateRating",
        //   ratingValue: "4.7",
        //   reviewCount: "7514"
        // },

        // review: {
        //   "@type": "Review",
        //   author: "Hank Jones",
        //   datePublished: "2016-11-01",
        //   description: "Yoast SEO is a great plugin.",
        //   name: "Awesome!",
        //   reviewRating: {
        //     "@type": "Rating",
        //     bestRating: "5",
        //     ratingValue: "5",
        //     worstRating: "1"
        //   }
        // }
      };
    }
  }

  addToCart(product) {

  
    this.closeSalePopup();
    if (!this.variantsize) {
      this.isSize = "notfound";
      setTimeout(() => {
        this.isSize = "found";
      }, 2000);
    }
    if (
      this.variantsize &&
      product &&
      product[0] &&
      product[0].options &&
      product[0].options.length > 0
    ) {
      const variantObject = {
        product_id: product[0].id,
        options: [
          { id: this.variantsize.sizeid, value: this.variantsize.sizevalueid }
        ],
        product: product[0]
      };
      // this.showSalePopup(variantObject, variantObject.product.name);
      this.cartItems.emit(variantObject);
    } else if (
      !this.variantsize &&
      product &&
      product[0] &&
      ((product[0].options && product[0].options.length == 0) ||
        !product[0].options)
    ) {
      const variantObject = {
        product_id: product[0].id,
        product: product[0]
      };
      this.cartItems.emit(variantObject);
      // this.showSalePopup(variantObject, variantObject.product.name);
      // if(!this.isSalePopup && this.popupProduct == 'mask') {
      //   this.cartItems.emit(variantObject);
      // }
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

  addToWishlistoutstock() {
    this.outofstockerror = true;
    setTimeout(() => {
      this.outofstockerror = false;
    }, 3000);
  }
  outofstockerroroverlay() {
    this.outofstockerror = false;
  }
  closesizeoverlay() {
    this.isSize = "found";
  }
  selectSize(sizeid, sizevalueid, sizename) {
    this.isSize = "found";
    this.activesize = sizename;
    // console.log('the variant size id is:',sizename, sizeid, sizevalueid);
    this.variantsize = { sizeid: sizeid, sizevalueid: sizevalueid ,sizename };
    // this.makeprice(sizename);    
    // console.log("variantsize select size",this.variantsize.sizename)
    // console.log("variantsPrice click",this.variantsPrice,this.variantsName);
    // console.log("variantsdata",this.variantsdata)
    let saleprice = this.productVariantsdata.filter(sizedata => sizedata.name == sizename);
    // console.log("test", saleprice[0].sale_price)
    this.detailSalePrice = saleprice[0].sale_price.toString();
    // console.log("test", saleprice[0].sale_price)
    this.detailPrice = saleprice[0].price.toString();

  }



  showdetails(event) {
    const el = event.currentTarget;
    el.classList.toggle("minuschange");
    if (el.nextSibling.style.display === "block") {
      el.nextSibling.style.display = "none";
    } else {
      el.nextSibling.style.display = "block";
    }
  }

  prodpopup() {
    this.proimagepopup = true;
  }
  hideprodpopup() {
    this.proimagepopup = false;
  }

  sizeguidepopup() {
    this.sizeguidepopupblock = true;
    this.sizeguideoverlay = true;
  }
  hidesizeguidepopup() {
    this.sizeguidepopupblock = false;
    this.sizeguideoverlay = false;
  }
  hidenoverlay() {
    this.sizeguidepopupblock = false;
    this.sizeguideoverlay = false;
  }

  get imageInarray() {
    let result = [];
    if (this.prodDetails && this.prodDetails[0] && this.prodDetails[0].images) {
      result = this.prodDetails[0].images.map(
        data => data.file.url + "?width=500"
      );
    }
    return result;
  }
  get fullimageInarray() {
    let result = [];
    if (this.prodDetails && this.prodDetails[0] && this.prodDetails[0].images) {
      // result = this.prodDetails[0].images.map(data => (data.file.url));
      result = this.prodDetails[0].images.map(
        data => data.file.url
      );
    }
    return result;
  }

  categoryName(data) {
    var all = {};
    data.forEach(function (data) {
      all[data.sort] = data;
    });

    var first = { id: all[1].id, name: all[1].name };
    if (all[2]) {
      var second = { id: all[2].id, name: all[2].name };
    }
    //var third = {id: all[3].id, name: all[3].name }
    // var third = {id: all[sid].id, name: all[sid].name }
    // console.log(data);
    return (first ? first.name : "") + " " + (second ? second.name : "");
  }

  addToWishlist(product) {
    // console.log(product);
    if (isPlatformBrowser(this.platform)) {
      if (this.cookieService.get("loginuser")) {
        this.wishlistloginerror = false;
        //  if ( this.variantsize ) {
        let variantObjectWishlist = {
          product_id: product[0].id,
          //  'options': [{ 'id' : this.variantsize.sizeid, 'value': this.variantsize.sizevalueid }],
          //  'size': this.activesize,
          product_info_slug: product[0].slug,
          product_image: product[0].images[0].file.url,
          product_name: product[0].name,
          product_color: product[0].attributes.color,
          product_currency: product[0].currency,
          product_sale_price: product[0].sale_price
        };

        this.wishlistData.emit(variantObjectWishlist);
        // } else {
        //   if (!this.variantsize) {
        //     this.isSize = 'notfound';
        //     setTimeout(() => {
        //       this.isSize = 'found';
        //      }, 3000);
        //   }
        // }
      } else {
        this.wishlistloginerror = true;
        this.openloginpopup.emit(true);
        setTimeout(() => {
          this.wishlistloginerror = false;
        }, 4000);
      }
      if (isPlatformServer(this.platform)) {
      }
    }
  }

  addedInWishlist(prodDetails) {
    this.newWishlistArray = this.getuserwishlist.filter(
      wishlist => wishlist.wishlist_item.product_id !== prodDetails[0].id
    );
    this.wishlistDataRemove.emit(this.newWishlistArray);

    // this.wishlistaddederror = true;
    // setTimeout(() => {
    //   this.wishlistaddederror = false;
    //  }, 2000);
  }
  toggleinfo() {
    this.info = !this.info;
  }

  moreclick() {
    this.moredetails = !this.moredetails;
  }

  /**
   * @method showSalePopup
   */
  public showSalePopup(product: any, productName: string) {
    this.popupProduct = productName.toLocaleLowerCase().includes('polo') ? 'polo' : (productName.toLocaleLowerCase().includes('mask') ? 'mask' : '');
    if(this.popupProduct == 'mask') {
      this.isSalePopup = product.product.attributes && product.product.attributes.popup && product.product.attributes.popup.toLowerCase() == 'true' ? true : false;
    } else if (this.popupProduct == 'polo') {
      this.isSalePopup = product.product.cross_sells && product.product.cross_sells.length > 0 ? true : false;
      if(this.isSalePopup) {
        const cross_sells = product.product.cross_sells;
        this.comboProduct = cross_sells;
      }
    } else {
      this.isSalePopup = false;
    }
    this.productOnPause = this.isSalePopup ? product : '';
  }

  /**
   * @method addToBag
   */
  public addToBag(event) {
    if(event.isCombo == false) {
      this.cartItems.emit(event.productToAdd);
    } else if (event.isCombo == true) {
      this.cartItems.emit(event.comboProduct);
    }
    setTimeout(() => {
      this.closeSalePopup();
    }, 5);
  }

  /**
   * @method closeSalePopup
   */
  public closeSalePopup() {
    this.popupProduct = '';
    this.isSalePopup = false;
    this.productOnPause = '';
  }
}
