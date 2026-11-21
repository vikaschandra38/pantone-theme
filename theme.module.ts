import { InfiniteScrollComponent } from '@app/infinite-scroll/infinite-scroll.component';
import { AppMegaMenuComponent } from "@theme/app-header/app-mega-menu";
import { CartComponent } from "@theme/cart/cart.component";
import { CartItemPreviewComponent } from "@theme/cart/cart-item-preview/cart-item-preview.component";
import { SignUpComponent } from "@theme/auth/sign-up/sign-up.component";
import { ContentfulService } from "@theme/contentful/app.contentful.service";
import { HeaderComponent } from "@theme/app-header/app-header.component";
import { FooterComponent } from "@theme/app-footer/app-footer.component";
// import { CartCheckoutFormComponent } from "@theme/cart/cart-checkout-form/cart-checkout-form.component";
import { CartCheckoutComponent } from "@theme/cart/cart-checkout/cart-checkout.component";
import { CartCheckoutRegisterComponent } from "@theme/cart/cart-checkout-register/cart-checkout-register.component";
import { CartAddShippingComponent } from "@theme/cart/cart-add-shipping/cart-add-shipping.component";
// import { OrderSucessComponent } from "@theme/cart/order-sucess/order-sucess.component";
// import { OrderFailureComponent } from "@theme/cart/order-failure/order-failure.component";
import { PrivacyPolicyComponent } from "@theme/content-pages/privacy-policy/privacy-policy.component";
import { ContentSidebarComponent } from "@theme/content-pages/content-sidebar/content-sidebar.component";
import { ReturnPolicyComponent } from "@theme/content-pages/return-policy/return-policy.component";
import { NotFoundComponent } from "@theme/content-pages/404/not-found.component";
import { CancellationPolicyComponent } from "@theme/content-pages/cancellation-policy/cancellation-policy.component";
import { ShippingPolicyComponent } from "@theme/content-pages/shipping-policy/shipping-policy.component";
import { TermsandConditionsComponent } from "@theme/content-pages/terms-and-conditions/terms-and-conditions.component";
import { StoreLocatorComponent } from "@theme/content-pages/store-locator/store-locator.component";
import { AboutUsComponent } from "@theme/content-pages/about-us/about-us.component";
import { faqComponent } from "@theme/content-pages/faq/faq.component";
import { ContactUsComponent } from "@theme/content-pages/contact-us/contact-us.component";
import { SizeGuideComponent } from "@theme/content-pages/size-guide/size-guide.component";
import { LoginComponent } from "@theme/auth/login/login.component";
import { ShoppingCartComponent } from "@theme/shopping-cart/shopping-cart.component";


// import { OutOfStockComponent } from "@theme/cart/out-of-stock-popup/out-of-stock-popup.component";
import { NguCarouselModule } from "@ngu/carousel";
import { LoginPopupComponent } from "@theme/auth/login-popup/login-popup.component";
import { LookbookComponent } from "@theme/content-pages/lookbook/lookbook.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LazyLoadImagesModule } from "ngx-lazy-load-images";
import { AgmCoreModule } from "@agm/core";
import { MatFormFieldModule } from "@angular/material/form-field";

import {
  MatCheckboxModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatExpansionModule,
  MatProgressSpinnerModule
} from "@angular/material";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatNativeDateModule } from "@angular/material";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { CalculateSizeComponent } from "@theme/calculate-size/calculate-size.component";
import { ProductListingComponent } from "@theme/product-listing/product-listing.component";
import { ProductFilterSidebarComponent } from "@theme/product-listing/product-filter-sidebar/product-filter-sidebar.component";
import { ProductListingHeaderComponent } from "@theme/product-listing/product-listing-header/product-listing-header.component";
import { ProductDetailsComponent } from "@theme/product-details/product-details.component";
// import { NgxJsonLdModule } from "@ngx-lite/json-ld";
import { PinchZoomModule } from "ngx-pinch-zoom";
import { CommonSliderComponent1 } from "@theme/common-slider.1";
// import { UpgradeModule } from "@angular/upgrade/static";
import { HttpClientModule } from "@angular/common/http";
import { ShippingAddressFormComponent } from "@theme/cart/shipping-address-form/shipping-address-form.component";
import { EventListComponent } from "@app/themes/pantone-theme/content-pages/event-list/event-list.component";
import { OwlModule } from "ngx-owl-carousel";
import { MatButtonModule } from "@angular/material/button";
import { CheckoutOrderDestailsComponent } from "@theme/cart/checkout-order-details/checkout-order-details.component";
import { ShippingAddressListingComponent } from "./cart/shipping-address-listing/shipping-address-listing.component";
import { SelectPaymentModeComponent } from "./cart/select-payment-mode/select-payment-mode.component";
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
// import { ShippingAddressListComponent } from "@app/themes/pantone-theme/shipping-address/components/shipping-address-list/shipping-address-list.component";
// import { PurchaseSummaryComponent } from "@app/themes/pantone-theme/shipping-address/components/purchase-summary/purchase-summary.component";
// import { CheckoutAddressFormComponent } from "@theme/shipping-address/components/checkout-address-form/checkout-address-form.component";
// import { CheckoutAddressComponent } from "@theme/shipping-address/components//checkout-address/checkout-address.component";
// import { CheckoutPaymentComponent } from './payment/components/payment/payment.component';
// import { ShippingAddressListComponent } from './shipping-address/components/shipping-address-list/shipping-address-list.component';
import { FormalsawComponent } from "@theme/content-pages/formalsaw/formalsaw.component";
import { SharedModule } from "@app/shared/shared.module";


import { MatCardModule } from "@angular/material/card";
import { OtpModule } from '@app/otp/otp.module';
import { SalePopUpComponent } from "@theme/special-sale/index";
import { MobileVerifyComponent } from '@app/otp/mobile-verify/mobile-verify.component';
import { OtpProcessComponent } from '@app/otp/otp-process.component';
import { NgOtpInputModule } from "ng-otp-input";
import { NgxPaginationModule } from "ngx-pagination";
import { CampaignPageComponent } from './content-pages/Campaign-Page/campaign-page.component';
import { CampaignPageTwoComponent } from './content-pages/Campaign-Page-two/campaign-page-two.component';
import { CampaignPageThreeComponent } from './content-pages/campain-pages/Campaign-Page-two/campaign-page-3.component';
// import { InfiniteScrollComponent } from '@app/infinite-scroll/infinite-scroll.component';



@NgModule({
  declarations: [
    MobileVerifyComponent,
    OtpProcessComponent,
    EventListComponent,
    LookbookComponent,
    PrivacyPolicyComponent,
    ContentSidebarComponent,
    ReturnPolicyComponent,
    NotFoundComponent,
    CancellationPolicyComponent,
    ShippingPolicyComponent,
    TermsandConditionsComponent,
    AboutUsComponent,
    faqComponent,
    ContactUsComponent,
    FormalsawComponent,
    SizeGuideComponent,
    CartComponent,
    CartItemPreviewComponent,
    LoginComponent,
    SignUpComponent,
    HeaderComponent,
    FooterComponent,
    CartAddShippingComponent,
    AppMegaMenuComponent,
    CartCheckoutRegisterComponent,
    // CartCheckoutFormComponent,
    CartCheckoutComponent,
    // OrderSucessComponent,
    //OrderFailureComponent,
    StoreLocatorComponent,
    // OutOfStockComponent,
    ShoppingCartComponent,
    LoginPopupComponent,
    ProductListingComponent,
    ProductFilterSidebarComponent,
    ProductListingHeaderComponent,
    CalculateSizeComponent,
    ProductDetailsComponent,
    CommonSliderComponent1,
    ShippingAddressFormComponent,
    CheckoutOrderDestailsComponent,
    ShippingAddressListingComponent,
    SelectPaymentModeComponent,
    CampaignPageComponent,
    // ShippingAddressListComponent,
    // CheckoutAddressFormComponent,
    // CheckoutAddressComponent,
    // PurchaseSummaryComponent,
    // CheckoutPaymentComponent
    // ShippingAddressListComponent,
    MobileVerifyComponent,
    OtpProcessComponent,
    SalePopUpComponent,
    InfiniteScrollComponent,
    CampaignPageTwoComponent,
    CampaignPageThreeComponent
  ],
  imports: [
    NgOtpInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDialogModule,
    OwlModule,
    // NgxJsonLdModule,
    PinchZoomModule,
    NguCarouselModule,
    CommonModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule,
    MatRadioModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LazyLoadImagesModule,
    MatDialogModule,
    SharedModule,
    // UpgradeModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAXKE_8efHWRxwTd0H9m5ip1SxOFsajsS4",
      libraries: ["places"]
    }),

    MatCardModule,
    OtpModule,
    NgxPaginationModule
  ],

  providers: [
    ContentfulService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  entryComponents: [ShippingAddressFormComponent],

  exports: [
    MobileVerifyComponent,
    FooterComponent,
    HeaderComponent,
    // OrderFailureComponent,
    //OrderSucessComponent,
    LoginComponent,
    CartComponent,
    CartAddShippingComponent,
    StoreLocatorComponent,
    LoginPopupComponent,
    ShoppingCartComponent,
    ProductListingComponent,
    ProductFilterSidebarComponent,
    ProductListingHeaderComponent,
    CalculateSizeComponent,
    ProductDetailsComponent,
    // ShippingAddressListComponent,
    CommonSliderComponent1
    // ShippingAddressListComponent,
    // CheckoutAddressFormComponent,
    // CheckoutAddressComponent,
    // PurchaseSummaryComponent,
    // CheckoutPaymentComponent,
  ]
})
export class ThemeModule {}
