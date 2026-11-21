import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  NgZone,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
//import { } from 'googlemaps';
//import { MapsAPILoader } from "@agm/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { mobile, isDesktop } from "@env/environment";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";
import { CartService } from "@app/shared/services/cart.service";
import { Store, select } from "@ngrx/store";

import * as fromContent from "@app/reducers";
//import * as content from "../../../../shared/actions/content.actions";
@Component({
  selector: "app-locator",
  templateUrl: isDesktop
    ? "./store-locator.component.html"
    : "./store-locator.component.mobile.html",
  styleUrls: isDesktop
    ? ["./store-locator.component.css"]
    : ["./store-locator.component.mobile.css"]
})
export class StoreLocatorComponent implements OnChanges, OnInit {
  @Input() storelocatorccontentfuldetails;
  @Input() storelocatorloading;
  @Input() storelocatorloaded;
  @Input() placeInfo;
  @Output() getReverseGeocode: EventEmitter<any> = new EventEmitter();
  address;
  geolocationmessage: string;
  lati: any;
  longi: any;
  lati2: any;
  longi2: any;
  locationdata: any;
  markers: any[];
  selectprovince = true;
  results = false;
  mapmaker = false;
  identifyplacebtn = true;
  @ViewChild("search", { static: false })
  public searchElementRef: ElementRef;
  currentCity: any;
  currentCityStores: any[];
  cities: any[];
  showpincodes = false;
  pincodesdata: any[];
  identifyLoading = false;
  scities = [];
  storeForm: FormGroup;
  mapblock = false;
  resultsblock = false;
  stateslist = [];
  citieslist: any[];
  citiesdata: any[];
  currentState: any;
  server: boolean;
  zoomLevel = 4.6;
  constructor(
    public meta: Meta,
    public title: Title,
    //private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private cartService: CartService,
    public store: Store<fromContent.AppState>,

    @Inject(PLATFORM_ID) private platform: Object
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.server = false;
    }
    if (isPlatformServer(this.platform)) {
      this.server = true;
    }

    this.identifyLoading = true;
    this.identifyplacebtn = true;
    this.selectprovince = true;
    this.mapmaker = true;
    this.results = true;
    this.currentCityStores = null;
  }
  getPlaceMarkers(currentCity, currentState) {
    let locations = [];
    if (
      this.storelocatorccontentfuldetails &&
      this.storelocatorccontentfuldetails.pageElements &&
      this.storelocatorccontentfuldetails.pageElements[3] &&
      this.storelocatorccontentfuldetails.pageElements[3].fields &&
      this.storelocatorccontentfuldetails.pageElements[3].fields.storesData
    ) {
      this.locationdata = this.storelocatorccontentfuldetails.pageElements[3].fields.storesData;
      if (this && this.locationdata) {
        this.locationdata.forEach(element => {
          locations.push(element.fields);
        });
        this.markers = locations;
      }
    }
  }
  getMarkers() {
    let locations = [];
    if (
      this.storelocatorccontentfuldetails &&
      this.storelocatorccontentfuldetails.pageElements &&
      this.storelocatorccontentfuldetails.pageElements[3] &&
      this.storelocatorccontentfuldetails.pageElements[3].fields &&
      this.storelocatorccontentfuldetails.pageElements[3].fields.storesData
    ) {
      this.locationdata = this.storelocatorccontentfuldetails.pageElements[3].fields.storesData;
      if (this.locationdata)
        this.locationdata.forEach(element => {
          locations.push(element.fields);
        });
      this.markers = locations;
      //this.currentCityStores = this.markers.filter(el => el.storeCity === this.currentCity)
    }
  }
  removeDuplicates(arr) {
    let unique_array = arr.filter(function (elem, index, self) {
      return index == self.indexOf(elem);
    });
    return unique_array;
  }
  async findStores(e) {
    this.zoomLevel = 4.6;
    if (this.storeForm.controls.city.status === "INVALID") {
      this.resultsblock = false;
      this.mapblock = false;
      this.selectprovince = true;
    }
    if (this.storeForm.controls.city.status === "VALID") {
      this.resultsblock = true;
      this.mapblock = true;
      this.selectprovince = false;
    }
    if (this.storeForm.controls.pincode.status === "INVALID") {
      this.resultsblock = false;
      this.mapblock = false;
      this.selectprovince = true;
    }
    if (this.storeForm.controls.pincode.status === "VALID") {
      this.resultsblock = true;
      this.mapblock = true;
      this.selectprovince = false;
    }
    if (this.storeForm.valid) {
      this.zoomLevel = 12;
    }
    console.log('come here');
    let results = [];
    if (this.storeForm.get('city').valid || this.storeForm.get('pincode').valid) {
      console.log(this.citiesdata);
      if (this.citiesdata) {
        this.currentCityStores = this.citiesdata.filter(el => {
          if (el.storeCity || e.pincode) {
            console.log(el.storeCity, e.pincode, 'gvvvvvvv');
            return (
              el.storeCity.trim() == (e.pincode != null && e.pincode.trim()) ||
              el.storeState.trim() == (e.city != null && e.city.trim())
            );
          }
        });
      }
      for (let store of this.currentCityStores) {
        if (
          store.hasOwnProperty("latitude") &&
          store.hasOwnProperty("longitude")
        ) {
          this.lati = JSON.parse(store.latitude);
          this.longi = JSON.parse(store.longitude);
          break;
        }
      }
    }

  }
  selectState(e) {
    this.showpincodes = true;

    let pincodesArray = [];
    console.log(this.cities);
    this.citiesdata = this.cities
      .filter(a => a !== undefined)
      .filter(al => al.storeState.trim() == e);
    this.citieslist = this.removeDuplicates(
      this.citiesdata.map(a => a.storeCity)
    );

    this.pincodesdata = pincodesArray;
    this.pincodesdata = this.removeDuplicates(this.pincodesdata);
    this.pincodesdata.sort();
  }

  selectCity(e) {
    //this.showpincodes = true;

    let pincodesArray = [];
    console.log(this.cities);
    this.citiesdata = this.cities
      .filter(a => a !== undefined)
      .filter(al => al.storeCity.trim() == e);
    this.citieslist = this.removeDuplicates(
      this.citiesdata.map(a => a.storeCity)
    );

    this.pincodesdata = pincodesArray;
    this.pincodesdata = this.removeDuplicates(this.pincodesdata);
    this.pincodesdata.sort();
  }
  ngOnChanges() {
    if (
      this.storelocatorccontentfuldetails &&
      this.storelocatorccontentfuldetails.pageElements &&
      this.storelocatorccontentfuldetails.pageElements[3] &&
      this.storelocatorccontentfuldetails.pageElements[3].fields &&
      this.storelocatorccontentfuldetails.pageElements[3].fields.storesData
    ) {
      this.locationdata = this.storelocatorccontentfuldetails.pageElements[3].fields.storesData;
      //this.getMarkers();
      let citys = [];
      if (this && this.locationdata)
        this.locationdata.forEach(element => {
          citys.push(element.fields);
        });
      if (citys.length > 0) {
        this.cities = citys;

        this.stateslist = this.cities
          .filter(b => b !== undefined)
          .map(a => a.storeState);
        this.stateslist = this.removeDuplicates(this.stateslist);
        this.citieslist = this.cities
          .filter(b => b !== undefined)
          .map(a => a.storeCity);
        this.citieslist = this.removeDuplicates(this.citieslist);
      }
    }
    if (this.placeInfo && this.placeInfo.results) {
      // this.placeInfo.results.forEach(element => {
      // this.placeInfo.results.address_components.forEach(el => {
      //   el.types.forEach(al => {
      //     if (al === "locality") {

      //       this.currentCity = el.long_name;
      //     }
      //     if (al === "administrative_area_level_1") {
      //       this.currentState = el.long_name;
      //     }
      //   });
      // });
      // });

      // this.placeInfo.results.forEach((element) => {
      this.placeInfo.results[0].address_components.forEach(element2 => {
        element2.types.forEach(element3 => {
          switch (element3) {
            case "administrative_area_level_1":
              this.currentState = element2.long_name;
              break;
            case "locality":
              this.currentCity = element2.long_name;
              break;
          }
        });
      });
      // });
      // console.log(
      //   this.currentCity,
      //   this.currentState,
      // );
      this.storeForm.setValue({
        city: this.currentState.trim(),
        pincode: this.currentCity.trim()
      });

      if (this.currentCity) {
        this.currentCityStores = this.markers.filter(el => {
          if (el) {
            return (
              el.storeCity.trim() == this.currentCity.trim() &&
              el.storeState.trim() == this.currentState.trim()
            );
          }
        });
      }
      // if (this.currentState)
      //   this.currentCityStores = this.markers.filter(
      //     el => {
      //       console.log(el.storeState, this.currentState);
      //       return el.storeState.trim() == this.currentState.trim()
      //     }
      //   );
    }

    this.identifyLoading = false;
  }
  ngOnInit() {
    this.storeForm = this.fb.group({
      city: [null, Validators.required],
      pincode: [null, Validators.required]
    });
    this.title.setTitle("Store Locator | Pantone");
    //this.getMarkers();

    this.setDefaultStore();
  }

  setDefaultStore() {
    this.lati = 21.1458;
    this.longi = 79.082;

    // this.store.dispatch(new content.StoreLocatorContentLoad());

    // this.store.pipe(select(fromContent.getstorelocatorpageContent)).subscribe(result => {
    //   this.storelocatorccontentfuldetails = result;
    //   if (result) {
    //     this.locationdata = this.storelocatorccontentfuldetails.pageElements[3].fields.storesData;
    //     this.storeForm.patchValue({
    //       city: ' Haryana',
    //       pincode: 'Delhi NCR'
    //     });
    //     const obj = {
    //       city: this.storeForm.value.city,
    //       pincode: this.storeForm.value.pincode
    //     };

    //     this.locationdata = this.storelocatorccontentfuldetails.pageElements[3].fields.storesData;
    //     //this.getMarkers();
    //     let citys = [];
    //     if (this && this.locationdata)
    //       this.locationdata.forEach(element => {
    //         citys.push(element.fields);
    //       });
    //     if (citys.length > 0) {
    //       this.cities = citys;

    //       this.stateslist = this.cities
    //         .filter(b => b !== undefined)
    //         .map(a => a.storeState);
    //       this.stateslist = this.removeDuplicates(this.stateslist);
    //       this.citieslist = this.cities
    //         .filter(b => b !== undefined)
    //         .map(a => a.storeCity);
    //       this.citieslist = this.removeDuplicates(this.citieslist);
    //     }
    //     this.selectCity(obj.city);
    //     this.findStores(obj);
    //   }

    // });
  }

  getAllLocations() {
    this.storelocatorccontentfuldetails;
  }

  identifyPlace() {
    this.storeForm.reset();
    this.storeForm.get("city").clearValidators();
    this.storeForm.get("pincode").clearValidators();

    this.storeForm.updateValueAndValidity();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.zoomLevel = 13;

        this.lati = position.coords.latitude;
        this.longi = position.coords.longitude;
        this.showPosition(position);
      });
    } else {
      this.geolocationmessage = "Geolocation is not supported by this browser.";
    }
    this.placeInfo = this.cartService.getAddressByLallong({
      lat: this.lati,
      lng: this.longi
    });
    this.placeInfo.subscribe(data => {
      if (data && data.results) {
        // data.results.forEach((element) => {
        data.results[0].address_components.forEach(element2 => {
          element2.types.forEach(function (element3) {
            if (element3) {
              switch (element3 && element2) {
                case "administrative_area_level_1":
                  this.currentState = element2.long_name;
                  break;
                case "locality":
                  this.currentCity = element2.long_name;
                  break;
              }
            }
          });
        });
        // });
        // });
        this.getPlaceMarkers(this.currentCity, this.currentState);
        this.getLocation();

        this.identifyLoading = true;
        this.identifyplacebtn = false;
        this.selectprovince = false;
        this.mapmaker = true;
        this.results = true;
        this.resultsblock = true;
        this.mapblock = true;
      }
    });
  }

  getGeoLocation() { }
  getLocation() {
    let locations = [];
    if (
      this.storelocatorccontentfuldetails &&
      this.storelocatorccontentfuldetails.pageElements &&
      this.storelocatorccontentfuldetails.pageElements[3] &&
      this.storelocatorccontentfuldetails.pageElements[3].fields &&
      this.storelocatorccontentfuldetails.pageElements[3].fields.storesData
    ) {
      this.locationdata = this.storelocatorccontentfuldetails.pageElements[3].fields.storesData;

      this.locationdata.forEach(element => {
        locations.push(element.fields);
      });
      this.markers = locations;

      this.currentCityStores = this.markers.filter(el => {
        if (
          el &&
          el.storeCity &&
          el.storeState &&
          this.storeForm.value.pincode &&
          this.storeForm.value.city
        ) {
          return (
            el.storeCity.trim() == this.storeForm.value.pincode.trim() ||
            el.storeState.trim() == this.storeForm.value.city.trim()
          );
        }
      });
      for (let store of this.currentCityStores) {
        if (
          store.hasOwnProperty("latitude") &&
          store.hasOwnProperty("longitude")
        ) {
          this.lati = JSON.parse(store.latitude);
          this.longi = JSON.parse(store.longitude);
          break;
        }
      }
    }

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     this.showPosition(position);
    //   });
    // } else {
    //   this.geolocationmessage = "Geolocation is not supported by this browser.";
    // }
  }
  mapReady() {
    this.getLocation();
  }

  showPosition(position) {
    this.lati = position.coords.latitude;
    this.longi = position.coords.longitude;
    this.getReverseGeocode.emit({ lat: this.lati, lng: this.longi });

    this.identifyLoading = false;
  }
  

  back() {
    this.selectprovince = true;
    this.resultsblock = false;
    this.mapblock = false;
    this.identifyplacebtn = true;
  }
}
