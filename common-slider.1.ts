import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { mobile, isDesktop } from "@env/environment";
import { OwlCarousel } from 'ngx-owl-carousel';
@Component({
  selector: 'common-slider-1',
  templateUrl: isDesktop
  ? "./common-slider.1.html"
  : "./common-slider.1.mobile.html",
  styleUrls: isDesktop
    ? ["./common-slider.1.css"]
    : ["./common-slider.1.mobile.css"]
})
export class CommonSliderComponent1 implements OnInit {
  @ViewChild('owlElement', { static: false }) owlElement: OwlCarousel;
  @Input() data:any;
  @Input() last;
  public first = 0;
  public slider = [];
  detailSimilarImageWidth = "?tr=w-300";
  mobiledetailSimilarImageWidth = "?tr=w-300";
  constructor() {
  }
  ngOnInit() {
  }
  makeprice(x) {
    if(x) {
      x = x.toString();
    }
    
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
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

trackById(index: number, product: any){
  // console.log("productsfffff",  product.id)
  return product.id;
}

  ngOnChanges(){
      if(this.data.length > 0){
        this.slider = this.data.slice(this.first, this.last);
      }
    
  }
  nextSlider(){
    this.last++;
    this.first++
    this.slider = this.data.slice(this.first, this.last);
  }
  prevSlider(){
    this.last--;
    this.first--;
    this.slider = this.data.slice(this.first, this.last);
  }

  trackByrecentId(index: number, product: any){
    //console.log("recent product.id", product.id)
    return product.id;
  }


}
