import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID,
  ViewChild
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import * as fromContent from "@app/reducers";
import { Store } from "@ngrx/store";
import { Meta, Title } from "@angular/platform-browser";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { environment, mobile, isDesktop } from "@env/environment";
import { OwlCarousel } from 'ngx-owl-carousel';
@Component({
  selector: "app-homepage",
  templateUrl: isDesktop
    ? "./app-homepage.component.html"
    : "./app-homepage.component.mobile.html",
  styleUrls: isDesktop
    ? ["./app-homepage.component.css"]
    : ["./app-homepage.component.mobile.css"]
})
export class HomepageComponent implements OnChanges, OnInit {
  @ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;
  @Input() homedata;
  @Input() homeloading;
  @Input() homeloaded;
  @Output() cartItems: EventEmitter<any> = new EventEmitter();
  @Input() contentfuldetails;
  @ViewChild('slideshow', { static: false }) slideshow: any;
  categoryslug: string;
  recentlyViewed = [];
  slider = [];
  totalSlides = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  last = 4;
  first = 0;
  showPage: any;
  imageUrlsArray: any;
  height2: string;
  mobileimagesArray: any;
  videobannerlink: any;
  // homedata: any;
  MobileImageWidth = "?tr=w-400";
  public schema:any;
  constructor(
    private contentSerive: ContentService,
    public store: Store<fromContent.AppState>,
    public meta: Meta,
    public title: Title,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.categoryslug = window.location.pathname;
    }
    if (isPlatformServer(this.platform)) {
    }
    if (mobile) {
      this.height2 = "500px";
    } else {
      this.height2 = "700px";
    }
  }

  nextSlider() {
    this.last++;
    this.first++;
    this.slider = this.recentlyViewed.slice(this.first, this.last);
  }
  prevSlider() {
    this.last--;
    this.first--;
    this.slider = this.recentlyViewed.slice(this.first, this.last);
  }
  ngOnChanges() {
    // this.schema = {
    //   "@context": "http://schema.org",
    //   "@type": "WebSite",
    //   name: environment.site_name,
    //   url: environment.site_url,
    //   "potentialAction": { "@type": "SearchAction",
    //   "target": "https://Pantone.com/categories/all-styles?search",    
    //   "query-input": "required name"
    //   }
    // };
    
    if (this.homedata && this.homedata.pageElements && this.homedata.pageElements[6] && this.homedata.pageElements[6].fields && this.homedata.pageElements[6].fields.desktopImagesvideo && this.homedata.pageElements[6].fields.desktopImagesvideo[0] && this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields && this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields.file && this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields.file.url){
    this.videobannerlink = this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields.file.url;
    }

    if (isPlatformBrowser(this.platform)) {
      var recnt_viewed = JSON.parse(localStorage.getItem("recent_viewed"));
      if (recnt_viewed) {
        this.recentlyViewed = recnt_viewed;
        this.slider = this.recentlyViewed.slice(this.first, this.last);
      }
    }
   

 
  }

    /**
   * Navigate Router Link From Slider
   * onNavigate
   */
  public onNavigate(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }
  public onNavigate1(filters) {
    console.log("filters",filters)
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }
  public onNavigate2(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }
  public onNavigate3(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }
  public onNavigate4(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }
  public onNavigate5(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }
  public onNavigate6(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }
  public onNavigate7(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }else {
      let QP = ''
      return QP
    }
  }

   /**
   * Navigate Router Link From Mega Menu List
   * onNavigateFromMegaMenu
   */
  public onNavigateFromMegaMenu(filters) {
    if (filters) {
      let QP = { "filters": decodeURI(filters) }
      return QP
    }
    else {
      let QP = ''
      return QP
    }
  }

  ngOnInit() {
    // this.contentSerive.getContentfulHomepageData().subscribe(
    //   (content) => {
    //       this.homedata = content;
    //       console.log(this.homedata)
    //       this.title.setTitle('Privacy Policy | Pantone')
    //   }
    // )
 if (this.homedata && this.homedata.pageElements && this.homedata.pageElements[6] && this.homedata.pageElements[6].fields && this.homedata.pageElements[6].fields.desktopImagesvideo && this.homedata.pageElements[6].fields.desktopImagesvideo[0] && this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields && this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields.file && this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields.file.url){
    this.videobannerlink = this.homedata.pageElements[6].fields.desktopImagesvideo[0].fields.file.url;
    }
    this.store.select<any>(fromContent.getContentLoaded).subscribe(bool => {
      this.showPage = bool;
    });
  }
}
