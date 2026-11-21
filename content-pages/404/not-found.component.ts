import {
  Component,
  OnInit,
  OnChanges,
  Inject,
  PLATFORM_ID,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import { SEOService } from '@app/shared/services/seo-service';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: "app-not-found",
  templateUrl: isDesktop
    ? "./not-found.component.html"
    : "./not-found.component.mobile.html",
  styleUrls: isDesktop
    ? ["./not-found.component.css"]
    : ["./not-found.component.mobile.css"]
})
export class NotFoundComponent implements OnInit  {
  categoryslug: string;
  notfounddata: any;
  urlcheck:boolean = true;
  constructor(
    private meta: Meta,
    private contentSerive: ContentService,
    private SEOService: SEOService,
    public title: Title,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    this.title.setTitle('Not Found | Pantone');

    
  }

  ngDoCheck() {
   
  }
  ngOnInit() {
    this.SEOService.PrerenderStatusCode();
    this.categoryslug = window.location.pathname;
    this.contentSerive.notfounddata().subscribe(content => {
      this.notfounddata = content;
      // console.log("sdfsdfd",this.notfounddata);
    });
   
  }
 
}
