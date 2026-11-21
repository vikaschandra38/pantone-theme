import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { CookieService } from "ngx-cookie";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { mobile } from "@env/environment";
@Component({
  selector: "app-newsletter-preferences",
  templateUrl: mobile
    ? "./newsletter-preferences.component.mobile.html"
    : "./newsletter-preferences.component.html",
  styleUrls: mobile
    ? ["./newsletter-preferences.component.mobile.css"]
    : ["./newsletter-preferences.component.css"]
})
export class NewsletterPreferencesComponent implements OnInit {
  women: boolean = false;
  kids: boolean = false;
  men: boolean = false;

  constructor(private cookieservice: CookieService) {}

  newslettermen() {
    this.men = !this.men;
  }
  newsletterwomen() {
    this.women = !this.women;
  }
  newsletterkids() {
    this.kids = !this.kids;
  }
  Selectall() {
    this.men = true;
    this.women = true;
    this.kids = true;
  }
  ngOnInit() {}
}
