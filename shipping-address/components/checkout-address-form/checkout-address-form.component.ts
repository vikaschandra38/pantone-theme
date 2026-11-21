import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from "@angular/core";
import { Cart } from "@app/cart/models/cart.model";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { MatRadioChange } from "@angular/material";
import { mobile, isDesktop } from "@env/environment";
import { Subscription } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { PATTERNS, VALIDATION_MESSAGES } from "@app/_constants/constants";

import { Store } from '@ngrx/store';
import * as user from '@app/user/actions/user.actions';

import * as fromUser from '@app/user/reducers';
import { UserService } from '@app/shared/services/user.service';
import { AnalyticsService } from '@app/shared/services/analytics.service';
import { Meta, Title } from "@angular/platform-browser";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartService } from '@app/shared/services/cart.service';
@Component({
  selector: 'app-checkout-address-form',
  templateUrl: isDesktop
    ? './checkout-address-form.component.html'
    : './checkout-address-form.component.mobile.html',
  styleUrls: isDesktop
    ? ['./checkout-address-form.component.css']
    : ['./checkout-address-form.component.mobile.css']
})

export class CheckoutAddressFormComponent implements OnInit, OnDestroy {

  addressForm: FormGroup;
  validationMessages = VALIDATION_MESSAGES;
  getPincodeServicebilityData: any;
  subscriptions$ = new Subscription();
  @Output() saveAddress: EventEmitter<any> = new EventEmitter();
  @Output() editAddress: EventEmitter<any> = new EventEmitter();
  @Output() updateCart: EventEmitter<any> = new EventEmitter();
  @Output() showAddressForm: EventEmitter<any> = new EventEmitter();
  @Input() userEmail;
  @Input() shippingLoading;
  @Input() shippingLoaded;
  @Input() shippingUpdateFailure;
  @Input() userAddressSaveLoading;
  @Input() userAddressSaveLoaded;
  @Input() userAddressSaveFailure;
  @Input() saveType;
  @Input() editData;
  @Input() addressList;
  @Input() userInfo;
  @Input() allAddresses;
  @Input() useraddresssaveloaded;
  @Input() useraddresssavefailure;
  @Input() userEditAddressSaveLoading;
  @Input() usereditaddresssaveloaded;
  @Input() usereditaddresssavefailure;
  @Input() useraddressremoveloading;
  @Input() useraddressremoveloaded;
  @Input() useraddressremovefailure;
  @Input() useraddressnullloading;
  @Input() useraddressnullloaded;
  @Input() useraddressnullfailure;
  alladdress: any;
  AddressSaved: boolean = false;
  emptyaddress: boolean = false;
  addnewaddress: boolean = false;
  useraddresssaveerror: boolean = false;
  usereditaddresssaveerror: boolean = false;
  visibleAddresses: any = {
    count: 2,
    data: []
  };

  constructor(
    private store: Store<any>,
    private fb: FormBuilder,

    private cartService: CartService,
    public title: Title,
    private router: Router
  ) {

    this.createAddressForm();

  }

  ngOnInit() {

    if (this.saveType === 'editForm') {
      this.addressForm.patchValue(this.editData.data);
      if (this.userInfo && this.userInfo.default_address_id) {

        this.addressForm.patchValue({
          default: (this.addressList[this.editData.editIndex].add_id == this.userInfo.default_address_id) ? true : false
        });
      }

    }
    // if (this.allAddresses.length > 0) {
    //   this.alladdress = this.allAddresses;
    //   this.AddressSaved = true;

    // } else {
    //   this.emptyaddress = true;
    //   this.AddressSaved = false;
    // }

    this.addressForm.get('pincode').valueChanges.subscribe((data) => {
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('saveType')) {
      if (this.addressList && this.addressList.length === 0) {
        this.saveType = 'addForm';
      }
    }

    if (changes.hasOwnProperty('userInfo')) {
      if (this.saveType === 'editForm') {
        this.addressForm.patchValue(this.editData.data);
        if (this.userInfo && this.userInfo.default_address_id) {

          this.addressForm.patchValue({
            default: (this.addressList[this.editData.editIndex].add_id == this.userInfo.default_address_id) ? true : false
          });
        }

      }
    }

  }

  createAddressForm() {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(PATTERNS.NAME)]],
      last_name: ['', [Validators.pattern(PATTERNS.NAME)]],
      mobile: [
        '',
        [
          Validators.minLength(10),
          Validators.required,
          Validators.pattern(PATTERNS.PHONE)
        ]
      ],
      pincode: ['', [Validators.required, Validators.pattern(PATTERNS.PINCODE)]],
      state: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      default: [false],
      address_type: ['1', [Validators.required]],
      // sat_open: [""],
      // sun_open: [""],s
      add_id: [new Date().toISOString()]
    });
  }
  keyPress(event: any) {
    let charCode = (event.query) ? event.query : event.keyCode;
    if (charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }


  defaultSelection(event) {
    if (event.checked) {
      this.addressForm.get('default').patchValue(true);
    } else {
      this.addressForm.get('default').patchValue(false);

    }
  }

  checkPincodeServiceable(formName) {

    //this[formName].get('pincode').set(null);

    if ((this[formName].value.pincode).toString().length == 6) {
      const pincodeObj = {
        "deliveryType": "forward",
        'drop_pincode': this[formName].value.pincode
      };
      this.store.dispatch(new user.CheckPincode(pincodeObj));
      this.subscriptions$.add(
        this.store.select(fromUser.pincodeServiceabilityLoaded).subscribe((data) => {
          if (data) {
            this.getPincodeServicebilityData = this.store.select(fromUser.pincodeServiceability).subscribe((pincodeData) => {
              if (pincodeData) {
                //   this[formName].get('pincode').setErrors({ notExist: false });
                this[formName].updateValueAndValidity();
                this[formName].patchValue(pincodeData);
                if (!pincodeData.isServiceable) {
                  this[formName].get('pincode').setErrors({ notServiceable: true });

                }
                this.addressForm.get("state").patchValue(pincodeData.state);
                this.addressForm.get("city").patchValue(pincodeData.city);

              } else {
                this[formName].get('city').reset();
                this[formName].get('state').reset();
                // this[formName].get('pincode').setValidators({
                //   pincode: ['', [Validators.required, Validators.pattern(PATTERNS.PINCODE)]],

                // });

                this[formName].get('pincode').setErrors({ notExist: true });


                return;
              }

            });
          }

        }));
    }

  }

  closingAddressForm() {
    if (this.addressList && this.addressList.length) {
      this.showAddressForm.emit(false);
    }

  }

  saveAddressDetails() {


    if (!this.addressForm.valid) {
      return;
    }
    if (this.saveType === 'editForm') {
      this.addressList[this.editData.editIndex] = this.addressForm.value;
      this.addressList[this.editData.editIndex]['updated_at'] = new Date().toISOString();

      // this.makeAddressDefault(this.addressList[this.editData.editIndex].add_id);
      const obj = {
        addressList: this.addressList,
        default_address_id: this.addressList[this.editData.editIndex]['default'] == true ? this.addressList[this.editData.editIndex]['add_id'] : undefined
      };
      this.editAddress.emit(obj);

      if (this.addressList[this.editData.editIndex]['default'] == true) {
        this.makeAddressDefault(this.addressForm.value.add_id);

      }
      // this.updateCartAddress(this.addressList[this.editData.editIndex]);

      // this.showAddressForm.emit(false);

    } else {

      this.addressForm.value.add_id = new Date().toISOString();
      let add_data = this.addressForm.getRawValue();
      add_data['updated_at'] = new Date().toISOString();
      if (this.addressList && this.addressList.length == 0) {
        // this.addressForm.get('default').patchValue(true);
        add_data['default_address_id'] = add_data['add_id'];


      }
      if (this.addressForm.value.default == true) {
        // this.makeAddressDefault(this.addressForm.value.add_id);
        add_data['default_address_id'] = add_data['add_id'];

      }

      this.cartService.changeShippingAddress(add_data);

      this.saveAddress.emit(add_data);
      // this.updateCartAddress(add_data);

    }

  }

  // updateCartAddress(add_data) {
  //   var dataCheckout = {
  //     first_name: add_data.name,
  //     last_name: add_data.last_name,
  //     email: this.userEmail,
  //     address2: add_data.address,
  //     city: add_data.city,
  //     country: "IN",
  //     state: add_data.state,
  //     zip: add_data.pincode,
  //     phone: add_data.mobile
  //   };
  //   this.cartService.changeShippingAddress(dataCheckout);


  //   this.updateCart.emit(dataCheckout);
  // }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
    this.addressForm.reset();
    this.addressForm.get('default').patchValue({
      default: [false]
    });

  }

  makeAddressDefault(add_id) {
    this.addressList = this.addressList.map((address) => {
      if (address.add_id === add_id) {
        address['default'] = true;
      } else {
        address['default'] = false;
      }
      return address;
    });
  }
  goBack() {
    if (this.addressList.length > 0) {
      this.closingAddressForm();
    } else {
      this.router.navigate(['/checkout/cart']);
    }

  }
}
