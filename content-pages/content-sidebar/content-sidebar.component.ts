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
@Component({
  selector: "content-sidebar",
  templateUrl: isDesktop
    ? "./content-sidebar.component.html"
    : "./content-sidebar.component.mobile.html",
  styleUrls: isDesktop
    ? ["./content-sidebar.component.css"]
    : ["./content-sidebar.component.mobile.css"]
})
export class ContentSidebarComponent implements OnChanges, OnInit {
  categoryslug: string;
  gerotex: any;
  constructor(
    private contentSerive: ContentService,
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
    // this.contentSerive.getContentfulGoretexData().subscribe(content => {
    //   this.gerotex = content;
    //   console.log(this.gerotex);
    // });
  }
}
