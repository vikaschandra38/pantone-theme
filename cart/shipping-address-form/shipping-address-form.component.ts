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
import { mobile } from "@env/environment";
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

export interface DialogData {
  formType: string;
  editData: any;
  editIndex: any;
  allAddress;
}
@Component({
  selector: 'app-shipping-address-form',
  templateUrl: mobile
    ? "./shipping-address-form.component.mobile.html"
    : "./shipping-address-form.component.html",
  styleUrls: mobile ? ["./shipping-address-form.component.mobile.css"] : ["./shipping-address-form.component.css"]
})

export class ShippingAddressFormComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;
  validationMessages = VALIDATION_MESSAGES;
  getPincodeServicebilityData: any;
  subscriptions$ = new Subscription();
  @Output() saveAddress: EventEmitter<any> = new EventEmitter();
  @Output() editAddress: EventEmitter<any> = new EventEmitter();
  @Output() shippingDetails: EventEmitter<any> = new EventEmitter();
  @Input() userEmail;
  @Input() useraddresssaveloading;
  formHeading: string;
  constructor(
    private store: Store<any>,
    private fb: FormBuilder,

    private cartService: CartService,
    public title: Title,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ShippingAddressFormComponent>,

  ) {

    this.createAddressForm();

  }

  ngOnInit() {
    this.formHeading = this.data.formType === 'editForm' ? 'Edit Address' : 'Add a new Address';
    if (this.data.formType === 'editForm') {
      this.addressForm.patchValue(this.data.editData);
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
      // address_type: ['1', [Validators.required]],
      // sat_open: [""],
      // sun_open: [""],
      add_id: [new Date().toISOString()]
    });
  }

  checkPincodeServiceable(formName) {

    this[formName].get('pincode').setErrors(null);

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
                this[formName].get('pincode').setErrors({ notExist: false });
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
                this[formName].get('pincode').setErrors({ notExist: true });

                return;
              }

            });
          }

        }));
    }

  }

  saveAddressDetails() {


    if (!this.addressForm.valid) {
      return;
    }
    if (this.data.formType === 'editForm') {
      this.data.allAddress[this.data.editIndex] = this.addressForm.value;

      const AllAddress = this.data.allAddress.map((address, index) => {
        if (index === this.data.editIndex) {
          address['default'] = true;
        }
        else {
          address['default'] = false;
        }
        return address;
      });



      this.dialogRef.close(AllAddress);

    } else {

      this.addressForm.value.add_id = new Date().toISOString();
      let add_data = this.addressForm.getRawValue();
      add_data['default'] = true;

      if (this.data && this.data.allAddress && this.data.allAddress.length) {
        this.data.allAddress = this.data.allAddress.map((address, index) => {
          if (address.add_id === this.addressForm.value.add_id) {
            address['default'] = true;
          }
          else {
            address['default'] = false;
          }
          return address;
        });
      }
      if (this.data.formType === 'addForm') {
        this.dialogRef.close(add_data);
      } else {
        this.saveAddress.emit(add_data);
        this.updateCartAddress(add_data);
      }
    }
  }

  updateCartAddress(add_data) {
    var dataCheckout = {
      first_name: add_data.name,
      last_name: add_data.last_name,
      email: this.userEmail,
      address2: add_data.address,
      city: add_data.city,
      country: "IN",
      state: add_data.state,
      zip: add_data.pincode,
      phone: add_data.mobile
    };
    this.cartService.changeShippingAddress(dataCheckout);


    this.shippingDetails.emit(dataCheckout);
  }
  keyPress(event: any) {
    var a = event.target.value;
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  closePopUp() {

    this.dialogRef.close();
  }

  defaultSelection(event) {
    if (event.checked) {
      this.addressForm.get('default').patchValue(true);
    } else {
      this.addressForm.get('default').patchValue(false);

    }
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }
}
