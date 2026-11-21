import { Component, OnInit, Input, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { mobile } from "@env/environment";
import { ContentService } from '../../contentful/content.service';
import { AnalyticsService } from '@app/shared/services/analytics.service';

@Component({
  selector: "order-sucess",
  templateUrl: mobile
    ? "./order-sucess.component.mobile.html"
    : "./order-sucess.component.html",
  styleUrls: mobile
    ? ["./order-sucess.component.mobile.css"]
    : ["./order-sucess.component.css"]
})
export class OrderSucessComponent implements OnInit {
  women: boolean = false;
  kids: boolean = false;
  men: boolean = false;
  recentlyViewed = [];
  slider = [];
  totalSlides = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  last = 4;
  first = 0;
  @Input() userorders;
  @Input() userorder;
  @Input() userOrderLoaded;
  @Input() userordersloaded;
  @Input() userordersloading;

  constructor(@Inject(PLATFORM_ID) private platform: Object) {
    if (isPlatformBrowser(this.platform)) {
      var sam = JSON.parse(localStorage.getItem("recent_viewed"));
      if (sam) {
        let lp = Object.keys(sam);
        lp.forEach(element => {
          this.recentlyViewed.push(sam[element]);
        });
        this.recentlyViewed = this.recentlyViewed.reverse();
        this.slider = this.recentlyViewed.slice(this.first, this.last);
      }
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

  newslettermen() {
    this.men = !this.men;
  }
  newsletterwomen() {
    this.women = !this.women;
  }
  newsletterkids() {
    this.kids = !this.kids;
  }
  Selectall() {
    this.men = true;
    this.women = true;
    this.kids = true;
  }

  ngOnInit() {}
}
