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
import { Title } from '@angular/platform-browser';
@Component({
  selector: "app-formalsaw",
  templateUrl: isDesktop
    ? "./formalsaw.component.html"
    : "./formalsaw.component.mobile.html",
  styleUrls: isDesktop
    ? ["./formalsaw.component.css"]
    : ["./formalsaw.component.mobile.css"]
})
export class FormalsawComponent implements OnChanges, OnInit {
  categoryslug: string;
  formalsaw: any;
  constructor(
    public title: Title,
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
    this.contentSerive.formalsawdata().subscribe(content => {
      this.formalsaw = content;
      this.title.setTitle("Formalsaw20 | Pantone");
    });
  }
}
