import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { mobile } from "@env/environment";
@Component({
  selector: "order-failure",
  templateUrl: mobile
    ? "./order-failure.component.mobile.html"
    : "./order-failure.component.html",
  styleUrls: mobile
    ? ["./order-failure.component.mobile.css"]
    : ["./order-failure.component.css"]
})
export class OrderFailureComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
