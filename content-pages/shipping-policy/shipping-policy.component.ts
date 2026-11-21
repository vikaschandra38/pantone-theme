import {
  Component,
  OnInit,
  OnChanges,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import { Meta, Title } from "@angular/platform-browser";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import { SEOService } from "@app/shared/services/seo-service";

@Component({
  selector: "shipping-policy",
  templateUrl: isDesktop
    ? "./shipping-policy.component.html"
    : "./shipping-policy.component.mobile.html",
  styleUrls: isDesktop
    ? ["./shipping-policy.component.css"]
    : ["./shipping-policy.component.mobile.css"]
})
export class ShippingPolicyComponent implements OnChanges, OnInit {
  categoryslug: string;
  privacypolicydata: any;
  shippingpolicydata: any;
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
    this.contentSerive.getContentfullprivacypolicydata().subscribe(content => {
      this.privacypolicydata = content;
      // this.title.setTitle(this.privacypolicydata.metaTitle)
      // this.title.setTitle("Shipping Policy | DukeIndia");
    });
    this.contentSerive.getContentshippingpolicy().subscribe(content => {
      this.shippingpolicydata = content;
      // this.title.setTitle("Shipping Policy | DukeIndia");
      this.seoService.setData(this.shippingpolicydata);
    });
  }
}
