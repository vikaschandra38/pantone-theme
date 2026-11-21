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
  selector: "cancellation-policy",
  templateUrl: isDesktop
    ? "./cancellation-policy.component.html"
    : "./cancellation-policy.component.mobile.html",
  styleUrls: isDesktop
    ? ["./cancellation-policy.component.css"]
    : ["./cancellation-policy.component.mobile.css"]
})
export class CancellationPolicyComponent implements OnChanges, OnInit {
  categoryslug: string;
  privacypolicydata: any;
  constructor(
    private contentSerive: ContentService,
    public meta: Meta,
    public title: Title,
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
    this.contentSerive.getContentfullprivacypolicydata().subscribe(content => {
      this.privacypolicydata = content;
      this.seoService.setData(this.privacypolicydata);
      //console.log(this.privacypolicydata);
      // this.title.setTitle("Cancellation Policy | DukeIndia");
    });
  }
}
