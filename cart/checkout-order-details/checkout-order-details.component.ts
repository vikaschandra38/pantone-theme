import { Component, OnInit, Input } from '@angular/core';
import { mobile } from "@env/environment";
@Component({
  selector: 'app-checkout-order-details',
  templateUrl: mobile
    ? "./checkout-order-details.component.mobile.html"
    : "./checkout-order-details.component.html",
  styleUrls: mobile ? ["./checkout-order-details.component.mobile.css"] : ["./checkout-order-details.component.css"]
})
export class CheckoutOrderDestailsComponent implements OnInit {
  @Input() cartinfo;
  ordersummery: any;
  viewdetails = true;
  hidedetails = false;
  bagdetails = false;
  constructor() { }

  ngOnInit() {
  }
  viewclick()  {
    this.bagdetails = true;
    this.viewdetails = false;
    this.hidedetails = true;
  }
  hideclick()  {
    this.bagdetails = false
    this.viewdetails = true;
    this.hidedetails = false;
  }

}
