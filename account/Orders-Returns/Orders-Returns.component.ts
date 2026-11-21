
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { CookieService } from "ngx-cookie";
import { UserOrders } from "@app/user/actions/user.actions";
import { getuserorderloading } from "@app/user/reducers";
import { mobile, environment } from "@env/environment";
import { isPlatformBrowser } from "@angular/common";
import { Meta, Title } from "@angular/platform-browser";


@Component({
  selector: "orders-returns",
  templateUrl: mobile
    ? "./Orders-Returns.component.mobile.html"
    : "./Orders-Returns.component.html",
  styleUrls: mobile
    ? ["./Orders-Returns.component.mobile.css"]
    : ["./Orders-Returns.component.css"]
})
export class OrdersReturnsComponent implements OnInit, OnChanges {
  @Input() userorders;
  @Input() userorderloaded;
  @Input() userorderloading;
  allOrders: any;
  showorders: any;
  noOrders: boolean;
  discounted_value;
  item_discount = 0;
  nonDraftOrders = [];
  showDropdown: boolean;
  constructor(
    private cookieservice: CookieService,
    @Inject(PLATFORM_ID) private platform: Object,
    public title: Title
  ) { }


  findTotal(articles) {
    let itemDiscount = 0;
    let totalDiscount = 0;
    itemDiscount = (parseFloat(articles.product.price) - parseFloat(articles.product.sale_price));
    totalDiscount = (itemDiscount * articles.quantity) + parseFloat(articles.discount_total);
    // console.log(typeof itemDiscount, typeof totalDiscount, typeof (articles.discount_total))
    // console.log(itemDiscount, totalDiscount, (articles.product.price) - totalDiscount);
    // console.log("this is total price is",  (articles.product.price * articles.quantity) - totalDiscount);
    return ((articles.product.price * articles.quantity) - totalDiscount);
  }
  ngOnInit() {
    
  }

  ngOnChanges() {
    //console.log(this.userorders);
    this.title.setTitle('Orders & Returns | Pantone')
    this.allOrders = this.userorders.results;
    this.nonDraftOrders = this.allOrders.filter(data=> data['status'] !== 'draft')
    // console.log('nonDraftOrders' , this.nonDraftOrders);

  if (this.nonDraftOrders && this.nonDraftOrders.length > 0) {
    this.showorders = true;
    this.noOrders = false;
  } else {
    this.showorders = false;
    this.noOrders = true;
  }

    

  }

  showDropMenu(){
    this.showDropdown = !this.showDropdown;
  }
  
  cancelOrder() { }

  show_price_details(event) {
    const el = event.currentTarget;
    el.classList.toggle("minusiconchange");
    if (el.nextSibling.style.display === "block") {
      el.nextSibling.style.display = "none";
    } else {
      el.nextSibling.style.display = "block";
    }
  }

  trackOrder(orderID, billing, orderItemId) {
    //console.log(order);
    //{{orderID}}##{{orderItemId}}##{{billingPhoneNumber}}
    const encodedString = btoa(`${orderID}##${orderItemId}##${billing.phone}`);
    if (isPlatformBrowser(this.platform)) {
      window.open(`${environment.trackOrderUrl}${encodedString}`, "_blank");
    }
  }
}
