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
  selector: "return-policy",
  templateUrl: isDesktop
    ? "./return-policy.component.html"
    : "./return-policy.component.mobile.html",
  styleUrls: isDesktop
    ? ["./return-policy.component.css"]
    : ["./return-policy.component.mobile.css"]
})
export class ReturnPolicyComponent implements OnChanges, OnInit {
  categoryslug: string;
  returnpolicy: any;
  privacypolicydata: any;
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
    this.contentSerive.getContentfullreturnpolicydata().subscribe(content => {
      this.returnpolicy = content;
      //this.title.setTitle(this.privacypolicydata.metaTitle)
      this.returnpolicy.metaTitle = "Return Policy | Pantone";
      // this.title.setTitle("Return Policy | DukeIndia");
      this.seoService.setData(this.returnpolicy);
    });
  }
}
