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
import { Router } from '@angular/router';
@Component({
  selector: "size-guide",
  templateUrl: isDesktop
    ? "./size-guide.component.html"
    : "./size-guide.component.mobile.html",
  styleUrls: isDesktop
    ? ["./size-guide.component.css"]
    : ["./size-guide.component.mobile.css"]
})
export class SizeGuideComponent implements OnChanges, OnInit {
  categoryslug: string;
  sizeguidedata: any;
  masks: string;
  all: string;
  constructor(private router: Router,
    private contentSerive: ContentService,public title: Title,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.categoryslug = window.location.pathname;
    }
    if (isPlatformServer(this.platform)) {
    }

    this.title.setTitle('Size Guide | Pantone');
  }

  ngOnChanges() {}
  ngOnInit() {
    this.masks = this.router.url; //  /routename
    console.log(this.masks)
    this.all = this.router.url;;
    console.log(this.all)

    this.contentSerive.sizeguidedata().subscribe(content => {
      this.sizeguidedata = content;
      console.log("sizeguidedata", this.sizeguidedata)
    });
  }
}
