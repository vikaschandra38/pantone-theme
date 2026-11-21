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
  selector: "app-reward-points",
  templateUrl: mobile
    ? "./reward-points.component.mobile.html"
    : "./reward-points.component.html",
  styleUrls: mobile
    ? ["./reward-points.component.mobile.css"]
    : ["./reward-points.component.css"]
})
export class RewardPointsComponent implements OnInit {
  constructor(private cookieservice: CookieService) {}

  ngOnInit() {}
}
