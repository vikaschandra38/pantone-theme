// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: "localhost",
  googleSiteVerification: "",
  plaadsgoogleSiteVerification: "",
  googleApiKey: "",
  facebookVerify:"",
  client_check: true,
  production: false,
  needOutOfStock: false,
  versionCheckURL: "/version-mobile.json",
  site_name: "Pantone",
  site_url: "m.pantone.com",
  pincodeUrl: "https://blackberrys.auperator.com/api/v1/",
  trackOrderUrl: "https://pantone.auperator.com/",
  contentful: {
    spaceId: "sqgqijrklwk0",
    token: "4M0E_A5kkePNlf_wu-OOfehJClOkHwymR_IIMT6kdkQ"
  },
  usealgoliadirectly: true,
  algolia_id: "W7AL34LYP4",
  search_key: "8da3746839fa84d56959e0330c48cc19",
  algolia_index: "ws_pantone_products",
  algolia_category_index: "ws_pantone_categories",
  SessionCreateurl:"https://cs-webstore-backend-dot-commerce-space-backend-staging.appspot.com/_ah/api/esbx/v1/session",
  variantsproduct:'https://cs-webstore-backend-dot-commerce-space-backend-staging.appspot.com/_ah/api/esb/v1/product',
  baseserviceurl: "https://cs-webstore-backend-dot-commerce-space-backend-staging.appspot.com/_ah/api/esb/v1/",
  baseserviceurl2: ".algolia.net/1/indexes/",
  googleid:"",
  client_secret: "",
  //orderapiurl: "https://test-dot-preorder-backend-staging.appspot.com/_ah/api/esb/v1/",
  orderapiurl: "https://cs-webstore-backend-dot-commerce-space-backend-staging.appspot.com/_ah/api/esb/v1/",
  facebookid: "",
  hitsperpage: 48,
  contentfulIds: {
    seoTags: "3jhdFUeHOL4p3soY5K5C2V",
    termandconditions: "2oyu5QtafHiPKOHLSHlueT",
    faq: "2sy7FLtLalitrdPvqnDfnI", //bb
    privacyData: "5TYihgk2pt9jfYfc1Xyg1r", //bb
    returnpolicyData: "4lMz1P9Vq6VBpXowWRBJ0B", //bb
    eventData: "5bWMwMWbIGp2UeFssadsN7", 
    shippingpolicy: "7EYgGqhV3eMHsUX3Yfiz0",
    aboutus: "1CIhrme9Ob849ZkkkdROpt",
    contactus: "GOKnADbXnmDT3Ct3rfqYR", //bb
    detailspage: "2pDLZ7bK3XKGsq4ZegFWnD",
    notfound: "7BuHh7JJkI39kjJhFZ4YNF", //
    isfpage:"433rSTajG5xgJMPkIuhPem", //bb
    homepage: "7x6pOkhYncf0WGnj7CPlM4",
    Footer: "5KdiZKzfw8b8Ew9VwtZIV5",
    Header: "1Ivmrnoj1XiMusyvxqZKWU",
    storelocator: "3Ar7LzhnYiRcZlftIt4DSO",
    sizeguide: "7GQhIfTkVZvegO3AF6d4Hn",
    lookbook: "1TS6hVsDEglGoQambqO8YG",
    fitguide: "r9TPcmhic2IqAMlqXaG74",
    formalsaw20: "352SUN4bfYwgtRovxQHzZO"
  },

  
  GTM_ID: "GTM-WVWSN8Z",
  isDesktop: false
};

export const mobile = true;
export const isDesktop = environment.isDesktop;
export const show_footer_listing_page = false;
export const header_show = true;
