import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShippingAddressFormComponent } from '../shipping-address-form/shipping-address-form.component';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { CartService } from '@app/shared/services/cart.service';
import { Store } from '@ngrx/store';
import * as fromUser from '@app/user/reducers';
import { mobile } from "@env/environment";


@Component({
  selector: 'app-shipping-address-listing',  
  templateUrl: mobile
    ? "./shipping-address-listing.component.mobile.html"
    : "./shipping-address-listing.component.html",
  styleUrls: mobile ? ["./shipping-address-listing.component.mobile.css"] : ["./shipping-address-listing.component.css"]
})
export class ShippingAddressListingComponent implements OnInit, OnDestroy {
  showAllAdrresses;
  @Input() userEmail;
  @Input() cartinfo;
  isShowAddress: boolean = false;
  @Input() alladdress;
  @Input() shippingloaded;
  @Input() shippingloading;
  // @Input() shippingAddressId;
  newAddressArray: any[];
  saveType;
  @Output() shippingDetails: EventEmitter<any> = new EventEmitter();
  @Output() removedAddressData: EventEmitter<any> = new EventEmitter();
  @Output() saveAddress: EventEmitter<any> = new EventEmitter();
  @Output() editAddress: EventEmitter<any> = new EventEmitter();
  @Output() isPincodeValid: EventEmitter<any> = new EventEmitter();
  @Input() pincodeData;
  @Input() pincodeDataLoading;
  @Input() pincodeDataLoaded;
  @Input() showPincodeValidity;
  @Input() pincodeErrorMessage;
  subscriptions$ = new Subscription();

  closeDialog$: Subscription;
  shippingNewAddress: any;
  @Input() emptyaddrss;
  @Input() savedaddress;
  subscription$ = new Subscription();
  // @Input() useraddressremovefailure;
  editindex;
  shippingAddressId = new FormControl(null, [Validators.required]);

  constructor(public dialog: MatDialog, public service: CartService, private store: Store<any>,
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (this.cartinfo && Object.keys(this.cartinfo.shipping).length !== 0) {
    //   this.alladdress = this.alladdress.map((address) => {
    //     if (address.add_id === this.cartinfo.shipping.add_id) {
    //       address['default'] = true;
    //     }
    //     else {
    //       address['default'] = false;
    //     }
    //     return address;
    //   });
    //   this.shippingAddressId.patchValue(this.cartinfo.shipping['add_id']);
    // }
    if (this.alladdress && this.alladdress.length) {
      this.alladdress = this.alladdress.map((address) => {
        if (!address.hasOwnProperty('default')) {
          address['default'] = false;
        }
        return address;

      });
    }
    const noDefault = this.alladdress.every((currentValue) => currentValue['default'] === false);
    if (noDefault) {
      this.shippingAddressId.patchValue(this.alladdress[0]['add_id']);
    } else {
      const defaultAddress = this.alladdress.find(element => element['default'] === true);
      this.shippingAddressId.patchValue(defaultAddress['add_id']);


    }
    this.alladdress.sort(function (x, y) { return x['default'] == true ? -1 : y['default'] == true ? 1 : 0; });

    if (this.alladdress && this.alladdress.length > 0) {
      this.showAllAdrresses = [];
      if (this.alladdress.length > 2) {
        for (let i = 0; i < 2; i++) {
          this.showAllAdrresses.push(this.alladdress[i]);
        }
      }
      else {
        this.showAllAdrresses = this.alladdress;
      }

      if (this.isShowAddress) {
        this.showAllAdrresses = this.alladdress;
      }
    }
    if (changes.hasOwnProperty('pincodeDataLoaded')) {
      this.pincodeDataLoaded = this.pincodeDataLoaded.currentValue;
    }

  }
  addnewaddress() {
    this.saveType = "addForm";
    this.openAddressForm();

  }
  editaddressclick(address_id) {
    this.saveType = "editForm";
    var b = this.alladdress.filter((address, index) => {
      if (address.add_id === address_id) {
        this.editindex = index;
      }
      return address.add_id === address_id;
    });

    this.openAddressForm(b[0]);
  }

  openAddressForm(editData?) {

    const dialogRef = this.dialog.open(ShippingAddressFormComponent, {
      width: "700px",
      data: {
        formType: this.saveType,
        editData: this.saveType == 'editForm' ? editData : undefined,
        editIndex: this.saveType == 'editForm' ? this.editindex : undefined,
        allAddress: this.alladdress
      }
    });
    this.subscription$.add(
      this.closeDialog$ = dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveType === 'editForm' ? this.editAddress.emit(this.alladdress) :
            this.saveAddress.emit(result);

        }
      })
    );

  }
  // all addresses show more or show less function
  showMoreAddress() {
    this.isShowAddress = true;
    this.showAllAdrresses = this.alladdress;
  }
  showLessAddress() {
    this.isShowAddress = false;

    this.showAllAdrresses = [];
    if (this.alladdress.length > 2) {
      for (let i = 0; i < 2; i++) {
        this.showAllAdrresses.push(this.alladdress[i]);
      }
    }
  }

  continueShipping() {
    if (!this.shippingAddressId) {
      return;
    }


    this.alladdress = this.alladdress.map((address) => {
      if (address.add_id === this.shippingAddressId.value) {
        address['default'] = true;
      }
      else {
        address['default'] = false;
      }
      return address;
    });
    this.shippingNewAddress = this.alladdress.find(
      address => address.add_id === this.shippingAddressId.value
    );

    this.service.changeShippingAddress(this.shippingNewAddress);
    var dataCheckout = {
      first_name: this.shippingNewAddress.name,
      last_name: this.shippingNewAddress.last_name,
      email: this.userEmail,
      address2: this.shippingNewAddress.address,
      city: this.shippingNewAddress.city,
      country: "IN",
      state: this.shippingNewAddress.state,
      zip: this.shippingNewAddress.pincode,
      phone: this.shippingNewAddress.mobile
    };
    this.isPincodeValid.emit(dataCheckout);
    // console.log(this.showPincodeValidity);
    // this.subscriptions$.add(

    //   this.store.select(fromUser.pincodeServiceabilityLoaded).subscribe((data) => {
    //     if (data && !this.showPincodeValidity) {



    //this.shippingDetails.emit(dataCheckout);
    //   }


    // })
    // );







  }
  remove(address_id) {
    if (this.shippingAddressId == address_id) {
      this.shippingAddressId.reset();
    }

    this.newAddressArray = this.alladdress.filter(
      address => address.add_id !== address_id
    );
    this.removedAddressData.emit(this.newAddressArray);
  }
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();

  }


}

