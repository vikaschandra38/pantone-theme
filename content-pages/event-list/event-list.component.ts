import {
  Component,
  OnInit,
  OnChanges,
  Inject,
  PLATFORM_ID,
  ViewChild
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import { Meta, Title } from "@angular/platform-browser";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import { SEOService } from "@app/shared/services/seo-service";
import { MatTabChangeEvent } from "@angular/material";
import {OwlCarousel} from 'ngx-owl-carousel';

@Component({
  selector: "app-event-list",
  templateUrl: isDesktop
    ? "./event-list.component.html"
    : "./event-list.component.mobile.html",
  styleUrls: isDesktop
    ? ["./event-list.component.css"]
    : ["./event-list.component.mobile.css"]
})
export class EventListComponent implements OnChanges, OnInit {

  @ViewChild('owlElement',{ static: false }) owlElement: OwlCarousel;
  
  categoryslug: string;

  Eventdata: any;

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

  ngOnChanges() {
  }
  ngOnInit() {
    this.title.setTitle("Event | Pantone");

    this.contentSerive.getContentfulleventdata().subscribe(content => {
      this.Eventdata = content;
      // this.seoService.setData(this.Eventdata);
      console.log("Eventdata",this.Eventdata);
      // this.title.setTitle("Event | Pantone");
    });

  }

}
