import { Injectable, OnInit } from "@angular/core";
import { ContentfulService } from "./app.contentful.service";
import { from } from "rxjs";
import { environment } from "@env/environment";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class ContentService {
  data: any;
  main_headers = {
    menuItemText: [],
    redirectLink: []
  };
  menu_icons = {
    iconLink: [],
    altText: [],
    redirectLink: []
  };
  subMenuVisible: boolean = false;
  subCategories: any[] = [];
  haveSubCategories: any[] = [];
  subFooterData: any[] = [];
  baseUrl = environment.baseserviceurl;

  constructor(private contentfulService: ContentfulService) { }

  getContentfulSeoData() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.seoTags, 5)
    );
  }

  getContentfulHeaderData() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.Header, 5)
    );
  }
  getContentfulFooterData() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.Footer, 5)
    );
  }
  getContentfuldetailspageData() {
    return from(
      this.contentfulService.getEntry(
        environment.contentfulIds.detailspage,
        5
      )
    );
  }
  notfounddata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.notfound, 5)
    );
  }
  getContentfulStoreLocatorData() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.storelocator, 5)
    );
  }
  gethomepagecontent() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.homepage, 5)
    );
  }
  getContentfullprivacypolicydata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.privacyData, 5)
    );
  }
  getContentfulleventdata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.eventData, 5)
    );
  }
  getContentfullreturnpolicydata() {
    return from(
      this.contentfulService.getEntry(
        environment.contentfulIds.returnpolicyData,
        5
      )
    );
  }
  getContentshippingpolicy() {
    return from(
      this.contentfulService.getEntry(
        environment.contentfulIds.shippingpolicy,
        5
      )
    );
  }
  termandconditionsdata() {
    return from(
      this.contentfulService.getEntry(
        environment.contentfulIds.termandconditions,
        5
      )
    );
  }
  aboutusdata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.aboutus, 5)
    );
  }
  faqdata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.faq, 5)
    );
  }

  isfdata(){
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.isfpage, 5)
    );
  }

  sizeguidedata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.sizeguide, 5)
    );
  }
  lookbookdata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.lookbook, 5)
    );
  }
  contactusdata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.contactus, 5)
    );
  }
  fitguidedata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.fitguide, 5))
  }
  formalsawdata() {
    return from(
      this.contentfulService.getEntry(environment.contentfulIds.formalsaw20, 5))
  }

  extractHeaderItems(data): any {
    //console.log(data);
    if (data.menuItems) {
      data.menuItems.map(subData => {
        let subDataFields = subData.fields;
        if (subDataFields.isIcon) {
          this.menu_icons.iconLink.push(
            subDataFields.iconImage[0].fields.file.url
          );
          this.menu_icons.altText.push(subDataFields.menuItemText);
          this.menu_icons.redirectLink.push(subDataFields.redirectLink);
        } else {
          this.main_headers.menuItemText.push(subDataFields.menuItemText);
          this.main_headers.redirectLink.push(subDataFields.redirectLink);
        }
      });
      return {
        main_headers: this.main_headers,
        menu_icons: this.menu_icons
      };
    }
  }

  extractSubCategories(data): any {
    data.menuItems.map(subData => {
      let subDataFields = subData.fields;
      if (subDataFields.haveSubcategories) {
        this.haveSubCategories.push(subDataFields.menuItemText);
        this.subCategories.push(subDataFields);
      }
    });
    return {
      haveSubCategories: this.haveSubCategories,
      subCategories: this.subCategories
    };
  }

  removeSys(data1): any {
    let keys = Object.keys(data1);
    keys.forEach(subKey => {
      if (subKey === "sys") {
        delete data1[subKey];
      }
      if (typeof data1[subKey] === "object") {
        this.removeSys(data1[subKey]);
      }
    });
    return data1;
  }

  getBaseFooter(content) {
    if (content && content.footer && content.footer[1]) {
      content.footer[1].fields.menuItems.map(subData => {
        this.subFooterData.push(subData);
      });
      return this.subFooterData;
    }
  }
}
