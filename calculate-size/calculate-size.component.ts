
import { Component, OnInit, ViewChild, Input, ComponentRef } from '@angular/core';
// import { UpgradeModule } from '@angular/upgrade/static';
import { CodeNode } from 'source-list-map';

@Component({
  selector: 'app-calculate-size',
  templateUrl: './calculate-size.component.html',
  styleUrls: ["./calculate-size.component.css"]
})
export class CalculateSizeComponent {
  // [x: string]: any;
    @Input() productInfo;
    code;
    producturl;
   
    @ViewChild('sizer', {static: true}) component;
    
    constructor(
      // private upgrade:UpgradeModule
      ) {}

    ngOnInit() { 
    
      // console.log('oh lord', this.productInfo.attributes.category);
      this.code = `BB-${this.productInfo.attributes.brand}-${this.productInfo.attributes.category}-${this.productInfo.attributes.style.trim()}`;

      // this.productcode = 'Urban Pantone-Shirt-Slim Fit';
      
      // this.calculateApparrelType();
          this.component.nativeElement.innerHTML ='<div fmf-widget-manager=""  product-code="' + this.code +'" product-image-url="'+ this.productInfo['images'][0]['file']['url']+'" product-price="'+ this.productInfo['price'] +'" product-description="'+this.productInfo['description']+'" enterprise-currency="INR" product-url="'+ this.productInfo['slug'] +'"></div>';

      // this.component.nativeElement.innerHTML = `<div fmf-widget-manager=""  product-code=${this.code} product-image-url=${this.productInfo['images'][0]['file']['url']} 
      // product-price=${this.productInfo['price']} product-description=${this.productInfo['description']} enterprise-currency=${this.productInfo['currency']} product-url=${this.productInfo['slug']}></div>`;

      
      // console.log("xxxxxxxxxx",this.component.nativeElement.innerHTML); 

      // console.log('productcode', this.code);
      // console.log("TYPE", typeof this.code)

    }

    ngAfterViewInit(){
      // this.upgrade.bootstrap(document.getElementById('cont'), [
      //   "fmf.widgets",
      //   "fmf.directives",
      //   "fmfWidgetApp"
      // ]);
    }

    
    
    // calculateApparrelType(){
    //   var listType = ['Shirts', 'Trousers',  'Khakis', 'T-Shirts', 'Jeans', 'Waist Coat', 'Jackets', 'Sweaters', 'Sweatshirts', 'Suits', 'Blazers', 'shorts'];
    //   var filtered = this.productInfo.category.filter(function (el) {
    //     return el != null;
    //   });
    //   var categorieslist = filtered.map(el => {
    //     if(el==undefined || el==null) {
    //       // console.log('22',el.name);
    //     }else {
    //       return el.name
    //       // console.log('111',el.name);
    //     }
    //   });
    //   // console.log('333',categorieslist)
    //   var found=[];
    //   // check if categorieslist contains any of the following listTypes
    //   listType.forEach(el => {
    //     categorieslist.forEach(item =>{
    //       if(item==el){
    //         found.push(item)
    //       }        
    //   })
    //  })
    //   console.log('found',found);
    //   return found;   
    // } 
}
