import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { Observable } from "rxjs";
import { ContentService } from "@theme/contentful/content.service";
import { HttpClient } from "selenium-webdriver/http";
import { ProductsService } from "../../../shared/services/products.service";
import { map, catchError } from "rxjs/operators";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { mobile } from "@env/environment";
@Component({
  selector: "app-footer",
  templateUrl: mobile
    ? "./app-footer.component.mobile.html"
    : "./app-footer.component.html",
  styleUrls: mobile
    ? ["./app-footer.component.mobile.css"]
    : ["./app-footer.component.css"]
})
export class FooterComponent implements OnChanges {
  @Input() footerContent: any;
  bool = false;
  subFooterData: any[] = [];
  @Input() isLoading: any;
  @Input() isLoaded: any;
  subscribeInput;
  isError: boolean = false;
  isBlank: boolean = true;
  isEmail: boolean = false;
  isSuccess: boolean = false;
  constructor(
    private contentService: ContentService,
    public http: ProductsService,
    @Inject(PLATFORM_ID) private platform: Object
  ) {}

  ngOnChanges() {
    // console.log("FOOTER", this.footerContent);
    if (Object.keys(this.footerContent).length !== 0) {
      //console.log(this.footerContent);
      this.subFooterData = this.contentService.getBaseFooter(
        this.footerContent
      );
      //console.log(this.subFooterData);
    }
  }


  trackById(index: number, product: any){
    //console.log("footer trackById", product.sys.id)
    return product.sys.id;
  }

  scrollTop() {
    if (isPlatformBrowser(this.platform)) {
      window.scrollTo({
        top: 0,
        left: 0
      });
    }
    if (isPlatformServer(this.platform)) {
    }
  }
  get getContactData() {
    if (this.footerContent) {
      return this.footerContent.footers[0].fields.menuItems[0].fields
        .menuItemText;
    }
  }

  get getPlaceholderData() {
    if (this.footerContent) {
      return this.footerContent.footers[0].fields.menuItems[1].fields
        .menuItemText;
    }
  }
  doSubscribe(input) {
    if (!this.checkValidation(input)) {
      this.isError = true;
    } else {
      this.isError = false;
      this.isBlank = false;
      this.isEmail = true;
      this.http.doScuscribe(input).subscribe(data => {
        //console.log(data);
        if (data["title"] == "Member Exists") {
          alert(data["detail"]);
        } else if (data["id"]) {
          this.isSuccess = true;
          this.subscribeInput = "";
        } else {
          alert("Error!!");
        }
      });
    }
  }
  keyupText(input) {
    if (!this.checkValidation(input)) {
      this.isError = true;
    } else {
      this.isError = false;
      this.isBlank = false;
      this.isEmail = true;
    }
  }
  checkValidation(emailField) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!emailField || emailField == "") {
      this.isError = true;
      this.isBlank = true;
      return false;
    } else if (reg.test(emailField) == false) {
      this.isError = true;
      this.isBlank = false;
      this.isEmail = false;
      return false;
    }
    return true;
  }
}
