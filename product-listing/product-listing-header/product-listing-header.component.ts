import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { mobile, isDesktop } from "@env/environment";

@Component({
  selector: "app-product-listing-header",
  // templateUrl: "./product-listing-header.component.html",
  // styleUrls: ["./product-listing-header.component.css"]

  templateUrl: isDesktop
    ? "./product-listing-header.component.html"
    : "./product-listing-header.component.mobile.html",
  styleUrls: isDesktop
    ? ["./product-listing-header.component.css"]
    : ["./product-listing-header.component.mobile.css"]

})
export class ProductListingHeaderComponent implements OnInit, OnChanges {
  @Input() categoryEntity;
  @Input() categoryChildren;
  @Input() filters;
  @Input() prodlen;
  @Input() loadedFilter;
  @Input() categoryexists;
  keywords;
  children;
  search;
  constructor(public router: Router) {
    this.search = router.parseUrl(router.url).queryParams["search"];
  }

  ngOnInit() {}
  ngOnChanges() {
    
    this.search = this.router.parseUrl(this.router.url).queryParams["search"];
    if (this.categoryEntity && this.categoryEntity.meta_keywords) {
      this.keywords = this.categoryEntity.meta_keywords.split(",");
      this.keywords.length = this.keywords.length - 1;
    }
    if (this.categoryChildren) {
      this.children = this.categoryChildren.results;
    }
  }
}
