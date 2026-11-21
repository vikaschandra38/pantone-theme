import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CartService } from '@app/shared/services/cart.service';

import { mobile, isDesktop } from '@env/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shipping-address-list',
  templateUrl: isDesktop
    ? './shipping-address-list.component.html'
    : './shipping-address-list.component.mobile.html',
  styleUrls: isDesktop 
    ? ['./shipping-address-list.component.css']
    : ['./shipping-address-list.component.mobile.css'] 
})

export class ShippingAddressListComponent implements OnInit, OnChanges {
  @Input() cartInfo;
  @Input() addressList;
  pincodeErrorMessage;
  saveType;
  @Input() shippingLoading;
  @Input() shippingLoaded;

  @Input() shippingUpdateFailure;
  shippingAddressId = new FormControl(null, [Validators.required]);
  @Output() checkFormType: EventEmitter<any> = new EventEmitter();
  @Output() showAddressForm: EventEmitter<any> = new EventEmitter();
  @Output() editAddressData: EventEmitter<any> = new EventEmitter();
  @Output() removedAddressData: EventEmitter<any> = new EventEmitter();
  @Output() isPincodeServiceable: EventEmitter<any> = new EventEmitter();
  @Output() addressSelected: EventEmitter<any> = new EventEmitter();
  @Output() shippingDetails: EventEmitter<any> = new EventEmitter();
  @Input() pincodeApiData;
  currentShippingAddress = {};
  shippingNewAddress;
  editIndex;
  @Input() userInfo;
  pincodeData;
  @Input() allAddresses;
  @Input() useraddresssaveloading;
  @Input() useraddresssaveloaded;
  @Input() useraddresssavefailure;
  @Input() usereditaddresssaveloading;
  @Input() usereditaddresssaveloaded;
  addSubscription$ = new Subscription();
  grandTotal = 0;
  isMobile;

  @Input() useraddressremoveloaded;
  pincodeObj = {
    pincodeData: null,
    error: false,
    pincodeErrorMsg: null,
    pincodeButtonErrorMsg: null

  };
  savedlist: boolean = true;
  selectedadddress: boolean = false;

  constructor(private cartService: CartService) {
    let currentPincodeData;
    this.setCurrentAddress();

    this.addSubscription$.add(
      this.cartService.currentpincodeServiceabilityData.subscribe((currentPincode) => {
        currentPincodeData = currentPincode;
      }));
    this.addSubscription$.add(
      this.shippingAddressId.valueChanges.subscribe((data) => {
        if ((currentPincodeData.pincodeData == null) || (currentPincodeData.pincodeData.pincode != data.pincode)) {
          this.cartService.changePincodeServiceablityData(this.pincodeObj);
          this.checkPincodeServiceability(data);



        } else {
          this.pincodeObj = currentPincodeData;


        }

        this.cartService.changeShippingAddress(data);

      }));

    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }


  setCurrentAddress() {
    this.addSubscription$.add(
      this.cartService.currentShippingAddress.subscribe((data) => {
        this.currentShippingAddress = data;
      }));
  }
  ngOnInit() {
    this.grandTotal = 0;
    //this.sortAddressList();
    // if (this.currentShippingAddress == null) {

    //   this.getSelectedAddress();
    // }
    if (this.isMobile) {
      this.selectedadddress = true;
      this.savedlist = false;
    }




    this.cartService.currentpincodeServiceabilityData.subscribe((pincodeData) => {
      this.pincodeData = pincodeData;
    });

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('addressList') || changes.hasOwnProperty('cartInfo')) {
      this.sortAddressList();
      if (!this.addressList.length) {
        this.saveType = 'addForm';
      }
      if (this.addressList.length === 1 && this.isMobile) {
        this.selectedadddress = true;
        this.savedlist = false;
      }

    }

  }

  sortAddressList() {
    this.addressList.sort(function (a, b) {
      if (a.hasOwnProperty('updated_at') && b.hasOwnProperty('updated_at')) {
        a = new Date(a.updated_at);
        b = new Date(b.updated_at);
      }
      return a > b ? -1 : a < b ? 1 : 0;
    });
    //this.changeSelectedAddress();
    this.getSelectedAddress();




  }




  getSelectedAddress() {
    var selectedAddress;
    const tempAddressList = this.addressList;
    if (tempAddressList.length) {

      if (this.cartInfo) {
        if (this.currentShippingAddress != null) {

          let selectedAddressArray = this.addressList.filter((address) => {
            return address.add_id == this.currentShippingAddress['add_id'];
          });
          if (selectedAddressArray.length) {
            //  this.shippingAddressId.setValue(selectedAddressArray[0]);
            selectedAddress = selectedAddressArray[0];
          } else {
            selectedAddress = tempAddressList.sort(function (a, b) {
              if (a.hasOwnProperty('updated_at') && b.hasOwnProperty('updated_at')) {
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
              }
            })[0];


            //this.shippingAddressId.setValue(selectedAddress);

          }

        } else {
          if (Object.keys(this.cartInfo.shipping).length === 0) {

            selectedAddress = tempAddressList.sort(function (a, b) {
              if (a.hasOwnProperty('updated_at') && b.hasOwnProperty('updated_at')) {
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
              }
            })[0];
          } else {

            if (this.cartInfo.shipping.hasOwnProperty('selected_address_id')) {
              let selectedAddressArray = tempAddressList.filter((address) => {
                return address['add_id'] == this.cartInfo.shipping['selected_address_id'];
              });
              if (selectedAddressArray && selectedAddressArray.length) {
                selectedAddress = selectedAddressArray[0];

              } else {
                selectedAddress = tempAddressList.sort(function (a, b) {
                  if (a.hasOwnProperty('updated_at') && b.hasOwnProperty('updated_at')) {
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                  }
                })[0];
              }

            } else {
              selectedAddress = tempAddressList.sort(function (a, b) {
                if (a.hasOwnProperty('updated_at') && b.hasOwnProperty('updated_at')) {
                  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                }
              })[0];


            }

          }
        }
      }
      this.shippingAddressId.setValue(selectedAddress);
      this.addressList.sort((x, y) => { return x['add_id'] == (this.userInfo && this.userInfo.default_address_id) ? -1 : y['add_id'] == this.userInfo.default_address_id ? 1 : 0; });

    }

  }

  checkPincodeServiceability(data) {
    this.isPincodeServiceable.emit(data);

  }

  addnewaddress() {
    this.saveType = "addForm";
    this.checkFormType.emit(this.saveType);
    this.showAddressForm.emit(true);

  }

  editaddressclick(address_id) {
    this.saveType = "editForm";
    var b = this.addressList.filter((address, index) => {
      if (address.add_id === address_id) {
        this.editIndex = index;
      }
      return address.add_id === address_id;
    });
    const editObj = {
      data: b[0],
      editIndex: this.editIndex
    };
    this.editAddressData.emit(editObj);
    this.checkFormType.emit(this.saveType);
    this.showAddressForm.emit(true);
    this.cartService.changeShippingAddress(b[0]);
    // this.openAddressForm(b[0]);
  }
  remove(address_id) {
    // if (this.shippingAddressId == address_id) {
    //   this.shippingAddressId.reset();
    // }

    const newAddressArray = this.addressList.filter(
      address => address.add_id !== address_id
    );
    this.removedAddressData.emit(newAddressArray);
  }
  continueShipping() {
    if (!this.shippingAddressId) {
      return;
    }
    const currentSelectedAddress = this.shippingAddressId.value;
    var dataCheckout = {
      first_name: currentSelectedAddress['name'],
      last_name: currentSelectedAddress['last_name'],
      email: this.userInfo.email,
      address2: currentSelectedAddress['address'],
      city: currentSelectedAddress['city'],
      country: "IN",
      state: currentSelectedAddress['state'],
      zip: currentSelectedAddress['pincode'],
      phone: currentSelectedAddress['mobile']
    };

    this.shippingDetails.emit(dataCheckout);

    // this.router.navigate(['/checkout/payment']);

  }

  confirmShipping() {
    this.savedlist = !this.savedlist;
    this.selectedadddress = !this.selectedadddress;
  }
  editandchange() {
    this.savedlist = !this.savedlist;
    this.selectedadddress = !this.selectedadddress;
  }
  // findIndex(add_id) {
  //   const index = this.addressList.map(e => e.add_id).indexOf(add_id) + 1;
  //   return index;

  // }

  getGrandTotal(event) {
    this.grandTotal = event;
  }
  ngOnDestroy(): void {
    this.addSubscription$.unsubscribe();

  }
}
