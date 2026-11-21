import { Component, OnInit } from "@angular/core";
import { mobile } from "@env/environment";
@Component({
  selector: "app-sign-up",
  templateUrl: mobile
    ? "./sign-up.component.mobile.html"
    : "./sign-up.component.html",
  styleUrls: mobile
    ? ["./sign-up.component.mobile.css"]
    : ["./sign-up.component.css"]
})
export class SignUpComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
