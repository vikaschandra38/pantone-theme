import {
  Component,
  OnInit,
  OnChanges,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import { SEOService } from "@app/shared/services/seo-service";

@Component({
  selector: "app-contact-us",
  templateUrl: isDesktop
    ? "./contact-us.component.html"
    : "./contact-us.component.mobile.html",
  styleUrls: isDesktop
    ? ["./contact-us.component.css"]
    : ["./contact-us.component.mobile.css"]
})
export class ContactUsComponent implements OnChanges, OnInit {
  categoryslug: string;
  contactusdata: any;
  telnumber: any;
  showemail: any;
  showaddress: boolean;
  showemail1: any;
  showcareermail: any;
  branchoffice: boolean;
  currentindex: any;
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

  ngOnChanges() {}
  ngOnInit() {
    this.contentSerive.contactusdata().subscribe(content => {
      this.contactusdata = content;
      console.log('contactusda;;;;;;;;ta',content);
      
      this.seoService.setData(this.contactusdata);
    });
  }
  telclick(){
    this.telnumber  =  !this.telnumber;
  }
  emailclick(){
    this.showemail  =  !this.showemail;
  }
  addressclick(){
    this.showaddress  =  !this.showaddress;
  }
  emailclick1(){
    this.showemail1  =  !this.showemail1;
  }
  careermailclick(){
    this.showcareermail  =  !this.showcareermail;
  }

  branchclick(i){
    // console.log("index of is " + i);
    
    if(this.currentindex === i){
      this.currentindex = null;
    }else{
    this.currentindex = i;
    // this.branchoffice = !this.branchoffice;
    }

  }
}
