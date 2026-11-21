import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { mobile, isDesktop } from "@env/environment";

@Component({
  selector: 'common-slider',
  templateUrl: isDesktop
  ? "./common-slider.html"
  : "./common-slider.mobile.html",
styleUrls: isDesktop
  ? ["./common-slider.css"]
  : ["./common-slider.mobile.css"]
})
export class CommonSliderComponent implements OnInit {
   @Input() data:any;
  @Input() last;
  public first = 0;
  public slider = [];
  constructor() {
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
  ngOnInit() {
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
}
