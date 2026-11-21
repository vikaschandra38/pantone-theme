import {
  Component,
  OnInit,
  OnChanges,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import { Meta, Title } from "@angular/platform-browser";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import { SEOService } from "@app/shared/services/seo-service";
@Component({
  selector: "terms-and-conditions",
  templateUrl: isDesktop
    ? "./terms-and-conditions.component.html"
    : "./terms-and-conditions.component.mobile.html",
  styleUrls: isDesktop
    ? ["./terms-and-conditions.component.css"]
    : ["./terms-and-conditions.component.mobile.css"]
})
export class TermsandConditionsComponent implements OnChanges, OnInit {
  categoryslug: string;
  termandconditionsdata: any;
  constructor(
    private contentSerive: ContentService,
    public meta: Meta,
    public title: Title,
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.categoryslug = window.location.pathname;
    }
    if (isPlatformServer(this.platform)) {
    }
  }

  ngOnChanges() {}
  ngOnInit() {
    this.contentSerive.termandconditionsdata().subscribe(content => {
      this.termandconditionsdata = content;
      console.log(' this.termandconditionsdata', this.termandconditionsdata);
      
      this.title.setTitle("Terms and Conditions | Pantone");
      this.seoService.setData(this.termandconditionsdata);
    });
  }
}
