import { Component, OnInit, OnChanges, Output, EventEmitter, Input, SimpleChanges, OnDestroy, } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { UserAddressSaveSuccess } from "@app/user/actions/user.actions";
import { mobile } from "@env/environment";
import { Meta, Title } from "@angular/platform-browser";
import { Store } from '@ngrx/store';
import * as user from '@app/user/actions/user.actions';
import * as fromUser from '@app/user/reducers';
import { VALIDATION_MESSAGES, PATTERNS } from '@app/_constants/constants';
import { CartService } from '@app/shared/services/cart.service';
@Component({
  selector: "app-address",
  templateUrl: mobile
    ? "./address.component.mobile.html"
    : "./address.component.html",
  styleUrls: mobile
    ? ["./address.component.mobile.css"]
    : ["./address.component.css"]
})
export class AddressComponent implements OnInit, OnChanges, OnDestroy {
  addnewaddress: boolean = false;
  emptyaddress: boolean = false;
  AddressSaved: boolean = false;
  addressForm: FormGroup;
  emptyaddressfields: boolean = false;
  weekends: boolean = false;
  @Input() cartInfo;
  @Output() addressData: EventEmitter<any> = new EventEmitter();
  @Output() editAddressData: EventEmitter<any> = new EventEmitter();
  @Output() removedAddressData: EventEmitter<any> = new EventEmitter();
  @Input() allAddresses;
  @Input() alladdressloading;
  @Input() alladdressloaded;
  @Input() useraddresssaveloading;
  @Input() useraddresssaveloaded;
  @Input() useraddresssavefailure;
  @Input() usereditaddresssaveloading;
  @Input() usereditaddresssaveloaded;
  @Input() usereditaddresssavefailure;
  @Input() useraddressremoveloading;
  @Input() useraddressremoveloaded;
  @Input() useraddressremovefailure;
  @Input() useraddressnullloading;
  @Input() useraddressnullloaded;
  @Input() useraddressnullfailure;
  @Output() isPincodeServiceable: EventEmitter<any> = new EventEmitter();
  @Input() userInfo;
  currentShippingAddress = {};
  alladdress: any;
  add_id: string;
  name: string;
  visibleAddresses: any = {
    count: 2,
    data: []
  };
  show_edit_button: boolean;
  save_new_address: boolean;
  getPincodeServicebilityData: any;
  editindex: any;
  newAddressArray: any[];
  useraddresssaveerror: boolean = false;
  usereditaddresssaveerror: boolean = false;
  namefielderror: boolean;
  mobilefielderror: boolean;
  pincodefielderror: boolean;
  statefielderror: boolean;
  addressfielderror: boolean;
  cityfielderror: boolean;
  validationMessages = VALIDATION_MESSAGES;
  shippingAddressId = new FormControl(null, [Validators.required]);
  pincodeObj = {
    pincodeData: null,
    error: false,
    pincodeErrorMsg: null,
    pincodeButtonErrorMsg: null

  };
  savedbtn: boolean = true;
  saveedit: boolean;
  showDropdown: boolean;
  constructor(private cookieservice: CookieService, private fb: FormBuilder,
    private cartService: CartService,
    private store: Store<any>,
    public title: Title) {

    this.shippingAddressId.valueChanges.subscribe((data) => {
      this.cartService.changePincodeServiceablityData(this.pincodeObj);
      this.cartService.changeShippingAddress(data);
      this.checkPincodeServiceability(data);
    });

    this.title.setTitle('Addresses | Pantone');
    this.addressForm = fb.group({
      name: [null, Validators.required],
      last_name: [null],
      mobile: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(PATTERNS.PHONE)
        ]
      ],
      pincode: [null, [Validators.required, Validators.pattern(PATTERNS.PINCODE)]],
      state: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      address_type: ["1", Validators.required],
      default: [false],
      sat_open: [null],
      sun_open: [null],
      add_id: [new Date().toISOString()]
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log("useraddressremoveloading " , this.useraddressremoveloaded , this.useraddressremoveloading)
    if (changes.hasOwnProperty('allAddresses')) {
      this.alladdress = this.allAddresses;
      if (this.alladdress.length > 0) {
        this.AddressSaved = true;
        this.emptyaddress = false;
      } else {
        this.emptyaddress = true;
        this.AddressSaved = false;
      }
      // this.visibleAddresses.data = [];
      // for (var i = 0; i < this.visibleAddresses.count; i++) {
      //   this.visibleAddresses.data.push(this.allAddresses[i]);
      // }
    }
    if (this.useraddressremoveloading) {
      this.emptyaddress = false;
      this.AddressSaved = false;
    }
    if (this.useraddressremoveloaded) {
      this.useraddressremoveloaded = false;
      this.alladdress = this.allAddresses;
      if (this.alladdress.length > 0) {
        this.AddressSaved = true;
      } else {
        this.emptyaddress = true;
        this.AddressSaved = false;
      }
    }

    if (this.useraddresssaveloaded) {
      this.addressForm.reset();
      this.addressForm.value.add_id = new Date().toISOString();
      this.addnewaddress = false;
      if (this.alladdress.length > 0) {
        this.AddressSaved = true;
      }
      this.useraddresssaveloaded = false;
      this.alladdress = this.allAddresses;
    }
    if (this.usereditaddresssaveloaded) {
      this.usereditaddresssaveloaded = false;
      this.addressForm.reset();
      this.addressForm.value.add_id = new Date().toISOString();
      this.addnewaddress = false;
      if (this.alladdress.length > 0) {
        this.AddressSaved = true;
      }
    }
    if (this.useraddresssavefailure) {
      this.useraddresssaveloading = false;
      this.useraddresssaveloaded = false;
      this.useraddresssaveerror = true;
      setTimeout(() => {
        this.useraddresssaveerror = false;
      }, 3000);
    }
    if (this.usereditaddresssavefailure) {
      this.usereditaddresssaveloading = false;
      this.usereditaddresssaveloaded = false;
      this.usereditaddresssaveerror = true;
      setTimeout(() => {
        this.usereditaddresssaveerror = false;
      }, 3000);
    }
  }

  showDropMenu(){
    this.showDropdown = !this.showDropdown;
  }
  
  checkPincodeServiceability(data) {
    this.isPincodeServiceable.emit(data);

  }
  editaddress(add_id) {
    this.show_edit_button = true;
    this.save_new_address = false;
    this.addnewaddress = true;
    this.emptyaddress = true;
    this.AddressSaved = false;
    this.savedbtn = false;
    this.saveedit = true;
    var b = this.alladdress.filter((address, index) => {
      if (address.add_id === add_id) {
        this.editindex = index;
      }

      return address.add_id === add_id;
    });

    this.name = b[0].name;

    this.addressForm = this.fb.group({
      add_id: [b[0].add_id, Validators.required],
      name: [b[0].name, Validators.required],
      last_name: [b[0].last_name],
      mobile: [
        b[0].mobile,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(PATTERNS.PHONE)
        ]
      ],
      pincode: [b[0].pincode, [Validators.required, Validators.pattern(PATTERNS.PINCODE)]],
      state: [b[0].state, Validators.required],
      address: [b[0].address, Validators.required],
      default: [false],
      city: [b[0].city, Validators.required],
      address_type: b[0].address_type,
      sat_open: b[0].sat_open,
      sun_open: b[0].sun_open
    });
  }

  saveeditaddress() {

    if (this.addressForm.controls.name.status === "INVALID") {
      this.namefielderror = true;
    }
    if (this.addressForm.controls.mobile.status === "INVALID") {
      this.mobilefielderror = true;
    }
    if (this.addressForm.controls.pincode.status === "INVALID") {
      this.pincodefielderror = true;
    }
    if (this.addressForm.controls.state.status === "INVALID") {
      this.statefielderror = true;
    }
    if (this.addressForm.controls.address.status === "INVALID") {
      this.addressfielderror = true;
    }
    if (this.addressForm.controls.city.status === "INVALID") {
      this.cityfielderror = true;
    }

    if (this.addressForm.status === "VALID") {
      this.emptyaddressfields = false;
      this.alladdress[this.editindex] = this.addressForm.value;
      let obj = {
        addressList: this.alladdress
      };
      this.editAddressData.emit(obj);
      // console.log("edit" , this.editAddressData, 'ddd', this.addressForm.status)
    }
    if (this.addressForm.status === "INVALID") {
      this.emptyaddressfields = true;
    }

  }

  add_new_address() {
    //debugger;
    //this.addressForm.reset();

    this.addressForm = this.fb.group({
      name: [null, Validators.required],
      last_name: [null],
      mobile: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(PATTERNS.PHONE)
        ]
      ],
      pincode: [null, [Validators.required, Validators.pattern(PATTERNS.PINCODE)]],
      state: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      address_type: ["1", Validators.required],
      default: [false],
      sat_open: [null],
      sun_open: [null],
      add_id: [new Date().toISOString()]
    });


    this.save_new_address = true;
    this.show_edit_button = false;
    this.addnewaddress = true;
    this.emptyaddress = true;
    this.AddressSaved = false;
    this.savedbtn = true;
    this.saveedit = false;
    //this.addressForm.reset();
  }

  saveaddress() {
    this.AddressSaved = false;
    this.addressForm.value.add_id = new Date().toISOString();
    //return false;
    var add_data = this.addressForm.getRawValue();
    if (this.addressForm.controls.name.status === "INVALID") {
      this.namefielderror = true;
    }
    if (this.addressForm.controls.mobile.status === "INVALID") {
      this.mobilefielderror = true;
    }
    if (this.addressForm.controls.pincode.status === "INVALID") {
      this.pincodefielderror = true;
    }
    if (this.addressForm.controls.state.status === "INVALID") {
      this.statefielderror = true;
    }
    if (this.addressForm.controls.address.status === "INVALID") {
      this.addressfielderror = true;
    }
    if (this.addressForm.controls.city.status === "INVALID") {
      this.cityfielderror = true;
    }
    if (this.addressForm.status === "VALID") {
      this.emptyaddressfields = false;
      this.addressData.emit(add_data);
    }
    if (this.addressForm.status === "INVALID") {
      this.emptyaddressfields = true;
    }
  }

  checkPincodeServiceable() {
    if ((this.addressForm.value.pincode).length === 6) {
      const pincodeObj = {
        "deliveryType": "forward",
        'drop_pincode': this.addressForm.value.pincode
      };
      this.store.dispatch(new user.CheckPincode(pincodeObj));
      this.store.select(fromUser.pincodeServiceabilityLoaded).subscribe((pincodeData) => {
        if (pincodeData) {
          this.getPincodeServicebilityData = this.store.select(fromUser.pincodeServiceability).subscribe((data) => {
            if (data) {
              this.addressForm.patchValue(data);
              if (!data.isServiceable) {
                this.pincodefielderror = true;
                this.addressForm.get('pincode').setErrors({ notServiceable: true });
                return;
              }
            } else {
              this.pincodefielderror = true;
              this.addressForm.get('city').reset();
              this.addressForm.get('state').reset();
              this.addressForm.get('pincode').setErrors({ notExist: true });
              return;
            }
          });
        }
      });
    }

  }
  cancel() {
    this.emptyaddressfields = false;
    this.emptyaddress = false;
    this.AddressSaved = true;
    // this.addressForm.value.add_id = new Date().toISOString();
    // this.addnewaddress = false;
    // if (this.alladdress.length === 0) {
    //   this.emptyaddress = true;
    // } else {
    //   this.AddressSaved = true;

    // }
    // this.addressForm.reset();
  }
  ngOnInit() {
    if (this.allAddresses.length > 0) {
      this.alladdress = this.allAddresses;
      this.AddressSaved = true;

    } else {
      this.emptyaddress = true;
      this.AddressSaved = false;
    }
  }

  toggleAdresses() {
    this.visibleAddresses.data = [];
    this.visibleAddresses['count'] = (this.visibleAddresses['count'] == 2) ? this.allAddresses.length : 2;

    if (this.visibleAddresses['data'].length != this.visibleAddresses['count']) {
      for (var i = 0; i < this.visibleAddresses.count; i++) {
        this.visibleAddresses.data.push(this.allAddresses[i]);
      }
    }
  }

  remove(address_id) {
    this.usereditaddresssaveloaded = false;
    this.usereditaddresssaveloaded = false;
    this.useraddressremoveloaded = false;
    this.newAddressArray = this.alladdress.filter(
      address => address.add_id !== address_id
    );
    this.removedAddressData.emit(this.newAddressArray);

  }
  clearmessages() {
    this.emptyaddressfields = false;
    this.namefielderror = false;
    this.mobilefielderror = false;
    this.statefielderror = false;
    this.pincodefielderror = false;
    this.cityfielderror = false;
    this.addressfielderror = false;
  }
  home() {
    this.weekends = false;
  }
  office() {
    this.weekends = true;
  }
  ngOnDestroy() {
    this.emptyaddressfields = false;
    this.namefielderror = false;
    this.mobilefielderror = false;
    this.statefielderror = false;
    this.pincodefielderror = false;
    this.cityfielderror = false;
    this.addressfielderror = false;
    if (this.save_new_address) {
      this.addressForm.reset();
    }
  }


  keyPress(event: any) {
    let charCode = (event.query) ? event.query : event.keyCode;
    if (charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }


}
