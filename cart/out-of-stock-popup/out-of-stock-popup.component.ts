import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from "@angular/core";
import { Router } from "@angular/router";
import { mobile } from "@env/environment";
@Component({
  selector: "app-out-of-stock",
  templateUrl: mobile
    ? "./out-of-stock-popup.component.mobile.html"
    : "./out-of-stock-popup.component.html",
  styleUrls: mobile
    ? ["./out-of-stock-popup.component.mobile.css"]
    : ["./out-of-stock-popup.component.css"]
})
export class OutOfStockComponent implements OnInit, OnChanges {
  @Input() showPopup = false;
  @Input() btnText = 'OKAY';
  @Output() confirmClicked = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter<boolean>();

  constructor(private router: Router) {}
  ngOnInit() {}
  ngOnChanges() {
  }

  onReviseCart() {
    this.confirmClicked.emit(false);
  }

  closeMessagePopup() {
    this.onClose.emit(false);
  }
}
