import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CartShippingComponent } from "@app/cart/containers/cart-shipping/cart-shipping.component";
//import { CampaignContainer } from "@app/shared/containers/campaign/campaign.component";
import { CheckoutGuard } from "@app/guards/checkout.guard";
import { OrderFailureContainer } from "@app/shared/containers/orders/order-failure-container.component";
import { OrderSuccessContainer } from "@app/shared/containers/orders/order-success-container.componet";
import { PrivacyPolicyComponent } from "@theme/content-pages/privacy-policy/privacy-policy.component";
import { ReturnPolicyComponent } from "@theme/content-pages/return-policy/return-policy.component";
import { NotFoundComponent } from "@theme/content-pages/404/not-found.component";
import { CancellationPolicyComponent } from "@theme/content-pages/cancellation-policy/cancellation-policy.component";
import { ShippingPolicyComponent } from "@theme/content-pages/shipping-policy/shipping-policy.component";
import { TermsandConditionsComponent } from "@theme/content-pages/terms-and-conditions/terms-and-conditions.component";
import { StoreLocatorContainer } from "@app/shared/containers/store-locator/storelocator.component";
import { AboutUsComponent } from "@theme/content-pages/about-us/about-us.component";
import { faqComponent } from "@theme/content-pages/faq/faq.component";
import { ContactUsComponent } from "@theme/content-pages/contact-us/contact-us.component";
import { SizeGuideComponent } from "@theme/content-pages/size-guide/size-guide.component";
import { LoginContainerComponent } from "@app/shared/containers/login/login.component";
import { ResetPasswordContainer } from "@app/user/containers/reset password/reset-password.component";
import { LookbookComponent } from "@theme/content-pages/lookbook/lookbook.component";
import { EventListComponent } from "@app/themes/pantone-theme/content-pages/event-list/event-list.component";
import { CheckoutComponent } from "@app/checkout/containers/checkout/checkout.component";
import { ShoppingCartContainerComponent } from "@app/cart/containers/shopping-cart/shopping-cart.component";
import { ShippingAddressComponent } from "@app/checkout/containers/shipping-address/shipping-address.component";
import { PaymentComponent } from "@app/checkout/containers/payment/payment.component";
import { FormalsawComponent } from "@theme/content-pages/formalsaw/formalsaw.component";
import { LoginComponent } from './auth/login/login.component';
import { LoginPopupComponent } from './auth/login-popup/login-popup.component';
import { CampaignPageComponent } from "./content-pages/Campaign-Page/campaign-page.component";
import { CampaignPageTwoComponent } from "./content-pages/Campaign-Page-two/campaign-page-two.component";
import { CampaignPageThreeComponent } from "./content-pages/campain-pages/Campaign-Page-two/campaign-page-3.component";

const routes: Routes = [
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("@app/shared/shared.module").then(m => m.SharedModule),
  //   runGuardsAndResolvers: "always"
  // },
  {
    path: "",
    pathMatch : "full",
    redirectTo : "categories/shop"
  },
  {
    path: "categories",
    loadChildren: () =>
      import("@app/products/productslist.module").then(
        m => m.ProductslistModule
      ),
    runGuardsAndResolvers: "always"
  },
  {
    path: "products",
    loadChildren: () =>
      import("@app/products/productslist.module").then(
        m => m.ProductslistModule
      ),
    runGuardsAndResolvers: "always"
  },
  {
    path: "tags",
    loadChildren: "@app/products/productslist.module#ProductslistModule",
    runGuardsAndResolvers: "always"
  },
  {
    path: "checkout",
    loadChildren: () =>
      import("@app/checkout/checkout.module").then(m => m.CheckoutModule),
    runGuardsAndResolvers: "always"
  },
  {
    path: "my-account",
    loadChildren: () =>
      import("@app/user/useraccount.module").then(m => m.UserAccountModule),
    runGuardsAndResolvers: "always",
    canActivate: [CheckoutGuard]
  },
  //{ path: "what-is-gore-tex", component: CampaignContainer },
  {
    path: "ordererror",
    component: OrderFailureContainer,
    data: {
      title: "Ordererror",
      description: "Ordererror Description Meta Tag Content"
    }
  },
  {
    path: "ordersuccess/:orderId",
    component: OrderSuccessContainer,
    data: {
      title: "Ordersuccess",
      description: "Ordersuccess Description Meta Tag Content"
    }
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
    data: {
      title: "privacy-policy",
      description: "privacy-policy Description Meta Tag Content"
    }
  },
  {
    path: "return-policy",
    component: ReturnPolicyComponent,
    data: {
      title: "return-policy",
      description: "return-policy Description Meta Tag Content"
    }
  },
  {
    path: "not-found",
    component: NotFoundComponent,
    data: {
      title: "not-found",
      description: "not-found Description Meta Tag Content"
    }
  },
  {
    path: "cancellation-policy",
    component: CancellationPolicyComponent,
    data: {
      title: "cancellation-policy",
      description: "cancellation-policy Description Meta Tag Content"
    }
  },
  {
    path: "shipping-policy",
    component: ShippingPolicyComponent,
    data: {
      title: "shipping-policy",
      description: "shipping-policy Description Meta Tag Content"
    }
  },
  {
    path: "terms-and-conditions",
    component: TermsandConditionsComponent,
    data: {
      title: "Terms-and-Conditions",
      description: "Terms-and-Conditions Description Meta Tag Content"
    }
  },
  {
    path: "store-locator",
    component: StoreLocatorContainer,
    data: {
      title: "Store Locator",
      description: "Store Locator Description Meta Tag Content"
    }
  },
  {
    path: "about-us",
    component: AboutUsComponent,
    data: {
      title: "About Us",
      description: "About Us Description Meta Tag Content"
    }
  },

  {
    path: "faqs",
    component: faqComponent,
    data: {
      title: "Faq",
      description: "Faq Description Meta Tag Content"
    }
  },
  {
    path: "contact-us",
    component: ContactUsComponent,
    data: {
      title: "ContactUs",
      description: "ContactUs Description Meta Tag Content"
    }
  },
  {
    path: "formalsaw20",
    component: FormalsawComponent,
    data: {
      title: "Formalsaw20",
      description: "Formalsaw20 Description Meta Tag Content"
    }
  },
  {
    path: "size_guide",
    component: SizeGuideComponent,
    data: {
      title: "Size Guide",
      description: "Size Guide Description Meta Tag Content",
      url: "https://size_guide.tobefilledlater@duke.com"
    }
  },
  // { path: "trigenic-sy/stem", component: TrigenicCampaignContainer },
  {
    path: "login",
    component: LoginPopupComponent,
    data: {
      title: "Login",
      description: "Login Description Meta Tag Content",
      url: "https://size_guide.tobefilledlater@duke.com"
    }
  },
  {
    path: "user/resetpassword/:id",
    component: ResetPasswordContainer,
    data: {
      title: "Reset Password",
      description: "Reset Password Description Meta Tag Content",
      url: "https://size_guide.tobefilledlater@duke.com"
    }
  },
  {
    path: "cart",
    component: ShoppingCartContainerComponent,
    data: {
      title: "Shopping Cart",
      description: "Cart"
    }
  },
  {
    path: "lookbook",
    component: LookbookComponent,
    data: {
      title: "Lookbook",
      description: "Lookbook"
    }
  },
  {
    path: "campaign-listing",
    component: EventListComponent,
    data: {
      title: "campaign listing",
      description: "campaign listing"
    }
  },
  {
    path: "user-account",
    loadChildren: () =>
      import("../../user/useraccount.module").then(m => m.UserAccountModule)
  },
  {
    path: "campaign",
    component: CampaignPageComponent,
    data: {
      title: "official statment ",
      description: "official statment"
    }
  },
  {
    path: "campaign-2",
    component: CampaignPageTwoComponent,
    data: {
      title: "Campaign Page ",
      description: "Campaign Page"
    }
  },
  {
    path: "campaign-3",
    component: CampaignPageThreeComponent,
    data: {
      title: "Campaign Page ",
      description: "Campaign Page"
    }
  },
  {
    path: "**",
    component: NotFoundComponent,    
  },
  {
    path: "not-found",
    component: NotFoundComponent,    
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
      scrollPositionRestoration: "enabled"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
