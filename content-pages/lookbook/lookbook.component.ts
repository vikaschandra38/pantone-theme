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
  selector: "app-lookbook",
  templateUrl: isDesktop ? "./lookbook.component.html" : "./lookbook.component.mobile.html",
  styleUrls: isDesktop ? ["./lookbook.component.css"] : ["./lookbook.component.mobile.css"]
})
export class LookbookComponent implements OnChanges, OnInit {
  categoryslug: string;
  lookbook: any;
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
    this.contentSerive.lookbookdata().subscribe(content => {
      this.lookbook = content;
      this.seoService.setData(this.lookbook);
      this.title.setTitle("lookbook | Pantone");
    });
  }
}
