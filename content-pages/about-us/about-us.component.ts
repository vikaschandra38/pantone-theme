import {
  Component,
  OnInit,
  OnChanges,
  Inject,
  PLATFORM_ID,
  ViewChild
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import { SEOService } from "@app/shared/services/seo-service";
//import { NguCarouselConfig } from '@ngu/carousel';
import { OwlCarousel } from 'ngx-owl-carousel';
@Component({
  selector: "app-about-us",
  templateUrl: isDesktop
    ? "./about-us.component.html"
    : "./about-us.component.mobile.html",
  styleUrls: isDesktop
    ? ["./about-us.component.css"]
    : ["./about-us.component.mobile.css"]
})
export class AboutUsComponent implements OnChanges, OnInit {
  @ViewChild('owlElement', {static: false}) owlElement: OwlCarousel;
  categoryslug: string;
  aboutusdata: any;
  showdot: any;
  active91: boolean = true;
  active96: any;
  active2: boolean;
  active06: boolean;
  active13: boolean;
  active14: boolean;
  active17: boolean;
  active19: boolean;
  limit:number=500
  public slider = [];
  aboutusdataCa=[];
  aboutusdataCa1=[]


  constructor(
    private contentSerive: ContentService,
    @Inject(PLATFORM_ID) private platform: Object,
    private seoService: SEOService
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.categoryslug = window.location.pathname;
    }
    if (isPlatformServer(this.platform)) {
    }
  }

  fun() {
    this.owlElement.next([200])
    //duration 200ms
  }

  ngOnChanges() {}
  ngOnInit() {
    this.contentSerive.aboutusdata().subscribe(content => {
      this.aboutusdata = content;
      this.aboutusdataCa=content.addComponents
      this.seoService.setData(this.aboutusdata);  
    for (let index = 0; index <  this.aboutusdataCa.length; index++) {
      if(index!=0){this.aboutusdataCa1.push(this.aboutusdataCa[index]); }      
    }
    this.aboutusdataCa1.pop();
    });


    // this.carouselTileItems.forEach(el => {
    //   this.carouselTileLoad(el);
    // });
  
  }

  click91(){
    this.active91 = true;
    this.active96 = false;
    this.active2 = false;
    this.active06 = false;
    this.active13 = false;
    this.active14 = false;
    this.active17 = false;
    this.active19 = false;
  }
  click96(){
    this.active91 = false;
    this.active96 = true;
    this.active2 = false;
    this.active06 = false;
    this.active13 = false;
    this.active14 = false;
    this.active17 = false;
    this.active19 = false;
  }
  click2(){    
    this.active91 = false;
    this.active96 = false;
    this.active2 = true;
    this.active06 = false;
    this.active13 = false;
    this.active14 = false;
    this.active17 = false;
    this.active19 = false;
  }
  click06(){
    this.active91 = false;
    this.active96 = false;
    this.active2 = false;
    this.active06 = true;
    this.active13 = false;
    this.active14 = false;
    this.active17 = false;
    this.active19 = false;
  }
  click13(){
    this.active91 = false;
    this.active96 = false;
    this.active2 = false;
    this.active06 = false;
    this.active13 = true;
    this.active14 = false;
    this.active17 = false;
    this.active19 = false;
  }
  click14(){
    this.active91 = false;
    this.active96 = false;
    this.active2 = false;
    this.active06 = false;
    this.active13 = false;
    this.active14 = true;
    this.active17 = false;
    this.active19 = false;
  }
  click17(){
    this.active91 = false;
    this.active96 = false;
    this.active2 = false;
    this.active06 = false;
    this.active13 = false;
    this.active14 = false;
    this.active17 = true;
    this.active19 = false;
  }
  click19(){
    this.active91 = false;
    this.active96 = false;
    this.active2 = false;
    this.active06 = false;
    this.active13 = false;
    this.active14 = false;
    this.active17 = false;
    this.active19 = true;
  }


}
