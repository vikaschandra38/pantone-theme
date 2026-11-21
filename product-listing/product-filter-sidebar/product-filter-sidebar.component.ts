import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { PriceRangeModel } from "@app/products/models/product.model";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from "@angular/animations";
import { Router } from "@angular/router";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
@Component({
  selector: "app-product-filter-sidebar",
  templateUrl: isDesktop
    ? "./product-filter-sidebar.component.html"
    : "./product-filter-sidebar.component.mobile.html",
  styleUrls: isDesktop
    ? ["./product-filter-sidebar.component.css"]
    : ["./product-filter-sidebar.component.mobile.css"]
})
export class ProductFilterSidebarComponent implements OnInit, OnChanges {
  minValue: number = 1999;
  maxValue: number = 10999;
  minimum: number;
  maximum: number;
  i;
  state: string = "small";
  filterSel: any = {};
  titleKeyArray: Array<string> = [];
  @Input() children;
  @Input() facets;
  @Input() facetStats;
  @Input() getUpdatedFilter;
  @Input() filters;
  @Input() loadedFilter;
  @Input() loadingFilter;
  @Output() selectedCheckboxFilters: EventEmitter<any> = new EventEmitter();
  @Output() closefilterpopup: EventEmitter<any> = new EventEmitter();
  @Output() clearFilterAll: EventEmitter<any> = new EventEmitter();
  @Output() retainEvent: EventEmitter<any> = new EventEmitter();
  @Input() nbHits;
  @Output() sortEvent: EventEmitter<any> = new EventEmitter();

  titleData = {
    "in_stock_variant_size.size.size": "Size",
    "attributes.style": "Fit",
    "attributes.brand": "Brand",
    "attributes.color": "Color",
    "attributes.colour_code": "Color",
    "attributes.category": "Product Type",
  };

  filterShow = true;
  initialFromFilter = 0;
  initialToFilter = 10000;
  panelOpenState;
  fromFilter = 0;
  toFilter = 10000;
  colourslist;
  sizes;
  ocassions;
  materials;
  selectedSizesArray = [];
  selectedOcassionsArray = [];
  selectedMaterialsArray = [];
  selectedColoursArray = [];
  selectedFilters: PriceRangeModel;
  filtersArray = [];
  sizeobject;
  materialobject;
  ocassionobject;
  colourobject;
  updatedSizesList = [];
  updatedOcassionsList = [];
  filtersHide = [];
  active = 3;
  statusval = true;
  activestatus = "active";
  pricerangeArray = [];
  allQueryParams: any;
  selectedfilterdata: any;
  selectedfilterkey: string;
  ischecked: any;
  currentindex: any;
  shortlist: boolean;
  showsortfilter: boolean;
  sortValue = {
    ws_pantone_products: "Default",
    eshopbox_products_relevance: "Relevance",
    ws_pantone_products_price_asc: "Price Ascending",
    ws_pantone_products_price_dec: "Price Descending",
    ws_pantone_products_alphabet_asc: "Aa-Zz",
    ws_pantone_products_alphabet_dec: "Zz-Aa",
    ws_pantone_products_price_discount:"Discount"
  };
  constructor(
    public router: Router,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    this.allQueryParams = router.parseUrl(router.url).queryParams;
    if (this.allQueryParams && this.allQueryParams["filters"]) {
      const splival = this.allQueryParams["filters"].split("::");
      splival.forEach(element => {
        var key = element.split(":");
        if (key[0] === "min_price") {
          this.minValue = JSON.parse(key[1]);
        }
        if (key[0] === "max_price") {
          this.maxValue = JSON.parse(key[1]);
        }
      });
    }
  }

  ngOnInit() {
    this.titleKeyArray = Object.keys(this.titleData);

    this.getFacetStats();
  }

  sortObject(array) {}

  toggleactivestatus(data) {
    console.log("data",data)
    if (data === "active") {
      return "inactive";
    } else if (data === "inactive") {
      return "active";
    }
  }
  filter_array(test_array) {
    let index = -1,
      resIndex = -1;
    const arr_length = test_array ? test_array.length : 0,
      result = [];

    while (++index < arr_length) {
      const value = test_array[index];

      if (value) {
        result[++resIndex] = value;
      }
    }

    return result;
  }

  getAllSelectedFilters() {
    this.filtersArray = [
      this.sizeobject,
      this.materialobject,
      this.ocassionobject,
      this.colourobject
    ];
    this.filtersArray = this.filter_array(this.filtersArray);
    this.selectedCheckboxFilters.emit(this.filtersArray);
  }

  checkBoxChecked(value) {
    return this.filtersArray.includes(value);
  }

  shortclick() {
    this.shortlist = !this.shortlist;
  }

  onChangeColours(value: string) {
    this.selectedColoursArray.push(value);
    if (this.selectedColoursArray.length > 0) {
      this.colourobject = {
        key: "attributes.colour",
        data: this.selectedColoursArray
      };
      // this.filtersArray.push(this.colourobject);
    }
    this.getAllSelectedFilters();
  }
  ngOnChanges() {

    if (this.loadedFilter) {
      if (isPlatformBrowser(this.platform)) {
        if (localStorage.getItem("selectedFilter") && this.selectedfilterdata) {
          if (this.ischecked) {
            this.retainEvent.emit(this.selectedfilterdata);
          }
          this.selectedfilterdata = null;
        }
      }
      if (isPlatformServer(this.platform)) {
      }
    }
    if (this.filters && this.filters.filters.length > 0) {
      let ss = {};
      if (this.getFilters.length > 0) {
        this.getFilters.forEach((d, i) => {
          ss[d.key] = i;
        });
        this.filters.filters.forEach(element => {
          this.filterSel[element.key] = ss[element.key];
        });
      }
    }
  }
  sliderChange($event) {
    this.fromFilter = $event.from;
    this.toFilter = $event.to;
    this.selectedFilters = { min_value: $event.from, max_value: $event.to };
  }

  toggleFilter(arg) {
    return !arg;
  }
  getFacets() {
    if (this.facets) {
      const keylist = Object.keys(this.facets);
      keylist.forEach(key => {
        if (key === "attributes.colour") {
          if (!this.colourslist) {
            this.colourslist = Object.keys(this.facets[key]);
          }
        }
        if (key === "attributes.size") {
          if (!this.sizes) {
            this.sizes = Object.keys(this.facets[key]);
          }
        }
        if (key === "attributes.ocassion") {
          if (!this.ocassions) {
            this.ocassions = Object.keys(this.facets[key]);
          }
        }
        if (key === "attributes.material") {
          if (!this.materials) {
            this.materials = Object.keys(this.facets[key]);
          }
        }
      });
    }
  }

  getFacetStats() {
    if (
      this.facetStats &&
      this.facetStats.sale_price &&
      this.facetStats.sale_price.min &&
      this.facetStats.sale_price.max
    ) {
      const filterlowest =
        this.facetStats.sale_price.min -
        (this.facetStats.sale_price.min % 1000);

      const filterhighest =
        this.facetStats.sale_price.max -
        (this.facetStats.sale_price.max % 1000) +
        1000;
      const iterations = (filterhighest - filterlowest) / 1000;
      for (let i = 0; i < iterations; i++) {
        this.pricerangeArray.push({
          min: filterlowest + 1000 * i,
          max: filterlowest + (1000 * (i + 1) - 1)
        });
      }
    }
  }

  filterToggle() {
    this.filterShow = !this.filterShow;
  }

  updateCheckboxes() {
    if (this.getUpdatedFilter) {
      this.getUpdatedFilter.subscribe(filt => {
        const key = Object.keys(filt);
        key.forEach(k => {
          if (k === "attributes.size") {
            filt[k].forEach((element, i) => {
              if (element.selected === true) {
                this.updatedSizesList.push(element.value);
              }
            });
          }
        });
      });
    }
  }
  get getFilters() {
    const result = [];
    this.getUpdatedFilter = this.getUpdatedFilter;
    if (this.getUpdatedFilter) {
      const filters = Object.keys(this.getUpdatedFilter);
      if (filters.length > 0) {
        filters.forEach(data => {
          result.push({ key: data, value: this.getUpdatedFilter[data] });
        });
      }
    }
    return result;
  }

  onChange(
    keys: string = null,
    value: string  = null,
    ischecked: Boolean  = true,
    selectedfiltervalues: any = null,
    isSubmitted: boolean = false
  ) {
    this.filters.isSubmitted = isSubmitted;
    if (this.filters.isSubmitted) {
      this.filters.page = 0;
      this.selectedCheckboxFilters.emit(this.filters);
      this.closefilter();
    } else {
      this.ischecked = ischecked;
      this.selectedfilterdata = { key: keys, value: selectedfiltervalues };
      this.selectedfilterkey = keys;
      this.selectedfilterdata = JSON.stringify(this.selectedfilterdata);
      if (isPlatformBrowser(this.platform)) {
        localStorage.setItem("selectedFilter", this.selectedfilterdata);
      }
      if (isPlatformServer(this.platform)) {
      }
      this.selectedfilterdata = JSON.parse(this.selectedfilterdata);
  
      if (this.filters && this.filters["filters"]) {
        var singleFilter = this.filters["filters"].filter(data => {
          return data["key"] === keys;
        });
        if (singleFilter.length == 0) {
          singleFilter.push({ key: keys, data: [] });
        }
        if (ischecked === true) {
          singleFilter[0].data.push(value);
        } else {
          singleFilter[0].data = singleFilter[0].data.filter(x => x !== value);
        }
        this.filters["filters"] = this.filters["filters"].filter(data => {
          return data["key"] !== keys;
        });
        this.filters["filters"].push(singleFilter[0]);
        this.filters.page = 0;
        this.selectedCheckboxFilters.emit(this.filters);
      }
    }
  }
  capturePriceRange() {
    this.onPriceChange(this.minimum, this.maximum, true);
  }
  onPriceChange(min, max, ischecked: Boolean) {
    if (this.filters && this.filters["price_range"]) {
      var singleFilter = [];

      if (ischecked === true) {
        singleFilter.push({ min: min, max: max });
      } else {
        singleFilter = singleFilter.filter(x => x.min !== min && x.max !== max);
      }
      this.filters["price_range"] = this.filters["price_range"].filter(
        data => data["min"] !== min && data["max"] !== max
      );
      if (singleFilter.length > 0) {
        this.filters["price_range"].push(singleFilter[0]);
      }
      this.filters.page = 0;
      this.selectedCheckboxFilters.emit(this.filters);
    }
  }

  changeTitle(key) {
    var data = {
      "attributes.size": "Size",
      "attributes.material": "Material",
      "attributes.occassion": "Occassion",
      "attributes.color": "Color",
      // sale_price: "Price Range",
      "attributes.technology": "Technology",
      "attributes.style": "Fit",
      "in_stock_variant_size.size.size": "Size",
      "attributes.fastening": "Fastening",
      "attributes.pattern": "Pattern",
      "attributes.fabric": "Fabric",
      "attributes.category": "Product Type",
      "attributes.brand": "Brand",
      "attributes.colour_code": "Color"
    };
    return data[key];
  }

  showmobileFilters(iter) {
    this.active = iter;
    this.filtersHide[iter] = !this.filtersHide[iter];
  }
  showFilters(key, iter) {
    this.showsortfilter = false;
    if (this.currentindex == iter) {
      this.currentindex = undefined;
    } else {
      this.currentindex = iter;
    }
    if (this.filterSel[key] === undefined) {
      this.filterSel[key] = iter;
    } else {
      delete this.filterSel[key];
    }
  }
  hidefilter() {
    this.currentindex = null;
    this.showsortfilter = false;
  }

  sortfilter() {
    this.showsortfilter = !this.showsortfilter;
    this.currentindex = null;
  }
  makeClass(str) {
    return str.replace(".", " ");
  }

  showdetails(event) {
    const element = event.currentTarget;
    element.classList.toggle("minuschange");
    if (element.nextSibling.style.display === "block") {
      element.nextSibling.style.display = "none";
    } else {
      element.nextSibling.style.display = "block";
    }
  }

  closefilter() {
 
    this.closefilterpopup.emit();
  }
  clearFilter() {
    this.clearFilterAll.emit();
  }

  sortBy(val) {
    this.sortEvent.emit(val);
    this.showsortfilter = !this.showsortfilter;
    this.currentindex = null;
  }
  get currentFilter() {
    return this.filters.sort;
  }
}
