import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { mobile, isDesktop } from '@env/environment';
import { ProductsService } from '@app/shared/services/products.service';
  
  @Component({
    selector: "app-sale-popup",
    templateUrl: isDesktop
    ? "./sale-popup.component.html"
    : "./sale-popup.component.mobile.html",

  styleUrls: isDesktop
    ? ["./sale-popup.component.css"]
    : ["./sale-popup.component.mobile.css"]
  })
  export class SalePopUpComponent implements OnInit {
    @Output() addItemToCart: EventEmitter<any> = new EventEmitter();
    @Input() popupProduct: string = '';
    @Input() productToAdd: any = '';
    @Input() comboProduct: any = '';
    @Output() addToBag: EventEmitter<any> = new EventEmitter();
    @Output() closePopup: EventEmitter<any> = new EventEmitter();
    public displayText: string = '';
    public displayPopupfor: string = 'Mask';
    public overlayPopup: boolean = true;
    public productPopup: boolean = true;

    constructor(private prodService: ProductsService){}

    ngOnInit(){
      if(this.popupProduct == 'polo') {
        this.displayText = 'Buy a Polo with this set of Independence Masks and on your behalf we will Donate a PPE kit to the front line Warrior';
      } else {
        this.displayText = 'Buy the set of Independence Masks at Rs 499 with this Polo & on your behalf we will Donate a PPE kit to the Front line Warrior';
      }
    }

    /**
     * @method addToCartCombo
     */
    public addToCartCombo() {
      this.prodService.getProductDetailById(this.comboProduct[0].product_id).subscribe((resp:any) => {
        if(resp) {
          let variantObject = {
            product_id: resp.hits[0].id,
            product: resp.hits[0]
          };
          this.addToCart(true, variantObject);
        }
      }, (error) => {
        console.log('error', error)
      })
    }

    /**
     * @method addToCart
     */
    public addToCart(isCombo: boolean = false, comboProduct: any = null) {
      const product = {
        'productToAdd': this.productToAdd,
        'isCombo': isCombo ? isCombo : false,
        'comboProduct': comboProduct
      }
        this.addToBag.emit(product);
        setTimeout(() => {
          this.onClosePopup();
        }, 5);
    }

    /**
     * to close the combo offer popup
     * @method onClosePopup
     */
    public onClosePopup() {
      this.overlayPopup = false;
      this.productPopup = false;
      this.closePopup.emit();
    }
  }