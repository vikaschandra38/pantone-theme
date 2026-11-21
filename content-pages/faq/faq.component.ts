import {
  Component,
  OnInit,
  OnChanges,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { ContentService } from "@theme/contentful/content.service";
import { Meta, Title } from "@angular/platform-browser";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { mobile, isDesktop } from "@env/environment";
import { SEOService } from "@app/shared/services/seo-service";
@Component({
  selector: "app-faq",
  templateUrl: isDesktop ? "./faq.component.html" : "./faq.component.mobile.html",
  styleUrls: isDesktop ? ["./faq.component.css"] : ["./faq.component.mobile.css"]
})
export class faqComponent implements OnChanges, OnInit {
  categoryslug: string;
  faqs: any;
  schema = {};
  public showMenu: boolean = false;
  public megaMenuSubMenu: any;
  hoverMenuName: any;
  constructor(
    private contentSerive: ContentService,
    public meta: Meta,
    public title: Title,
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.categoryslug = window.location.pathname;
    }
    if (isPlatformServer(this.platform)) {
    }

    
  }

  ngOnChanges() {
  }
  ngOnInit() {
    this.schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
          {
              "@type": "Question",
              name: "WHAT ARE THE PAYMENT OPTIONS AVAILABLE ON Pantone.COM?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "Pantone Online Store offers the following methods of payment: Credit Card / Debit Card, Internet Banking and Cash on delivery for selected pin codes (you can check whether COD payment is applicable in your area at the time of making the purchase)",
              },
          },
          {
              "@type": "Question",
              name: "WHAT ARE THE DELIVERY COSTS?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "We offer free shipping for all products",
              },
          },
          {
              "@type": "Question",
              name: "I AM UNABLE TO COMPLETE THE ORDER USING THE CREDIT CARD PAYMENT OPTION.",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "Check whether all the required fields have been filled correctly and ensure the secure password is also entered correctly in the payment gateway.",
              },
          },
          {
              "@type": "Question",
              name: "HOW LONG WILL THE DELIVERY TAKE?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "The orders are normally shipped within 2 working days from the date of placing the order. They are delivered to the customers address within 7 working days (must be serviceable locations) by our official courier. If the service is not available, then the product will be dispatched through other courier agencies / post which would normally take 10 – 12 working days to deliver.",
              },
          },
          {
              "@type": "Question",
              name: "HOW DO I CHECK THE STATUS OF MY ORDER?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "You will receive an order confirmation by email usually within 15 minutes of completing your order. You will also receive a confirmation by SMS on your given mobile number",
              },
          },
          {
              "@type": "Question",
              name: "CAN I SUBSEQUENTLY CHANGE AN ITEM IN MY ORDER?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "It is not possible to subsequently change sizes or colours of items, or to add or delete items, once you have placed your order. Please enter a new order in the Pantone Online Store and cancel the order you want to change (Cancellation terms and conditions are applicable).",
              },
          },
          {
              "@type": "Question",
              name: "CAN I CANCEL MY ORDER?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "As long as the package has not been dispatched from our warehouse, the order could be canceled. Cancellations can be carried out by contacting our Customer Service on 9810000209. If the package has already been dispatched, we won’t be able to cancel the order. However, you can initiate a return once you have received the order, as long the product is unused and is in compliance with our return terms and conditions.",
              },
          },
          {
              "@type": "Question",
              name: "WHAT HAPPENS IF I AM NOT AT HOME WHEN THE PACKAGE IS DELIVERED?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "In case you are not available at your shipping address at the time of delivery, our courier partner will get in touch with you on your mobile number and re-attempt the delivery during standard working hours. Repeated fail delivery attempts will result in the order being cancelled.",
              },
          },
          {
              "@type": "Question",
              name: "CAN I EXCHANGE AN ITEM?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "You can return all items purchased from the Pantone Online Store within 10 days of receiving your product. Please note that it is only possible for us to accept items that are returned in their original state. The merchandise should not show signs of usage. Direct exchange of products is not possible, however after cancelling the order; you can place a fresh order on Pantone.com.",
              },
          },
          {
              "@type": "Question",
              name: "WITHIN HOW MANY DAYS CAN I RETURN AN ITEM?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "You can return any item purchased on Pantone.com within 30 days of purchasing the product, as long as the product is unused and has its original packaging and tags. - Reimbursement is usually completed in 7 to 25 working days, after receiving and conducting the quality check of your returned package. -The value of the returned product will be credited to your Credit/Debit Card/Net banking account. In case of COD orders, you need to provide us with relevant bank details in order to process the refund.",
              },
          },
          {
              "@type": "Question",
              name: "I HAVE RETURNED AN ITEM, NOW HOW DO I GET MY MONEY BACK?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "Please understand that we can only accept items purchased from our Pantone Online Store.",
              },
          },
          {
              "@type": "Question",
              name: "CAN I RETURN SOMETHING THAT WAS NOT ORDERED FROM THE Pantone ONLINE STORE?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "Please understand that we can only accept items purchased from our Pantone Online Store.",
              },
          },
          {
              "@type": "Question",
              name: "I WOULD LIKE TO RETURN A DAMAGED, FAULTY OR INCORRECT ITEM, HOW DO I DO THIS?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "Please send the merchandise back to our address below through a known courier agency: Pantone Apparel Plot no. 7, IMT, Manesar, Haryana – 122050 Phone : 0124-4702800 Alternatively, you can check with our customer care, if your pin code is serviceable for a reverse pick up.We will check the issue once we receive the returned merchandise and arrange to send a replacement to your shipping address.",
              },
          },
          {
              "@type": "Question",
              name: "CAN I ORDER AN ITEM THAT I CANNOT FIND IN THE Pantone ONLINE STORE?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "We can only fulfill orders that are available in the Pantone Online Store",
              },
          },
          {
              "@type": "Question",
              name: "CAN YOU SEND ME A CATALOGUE?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pantone products are only available for online viewing. Unfortunately, we will not be able to send you a printed version of the catalogue.",
              },
          },
          {
              "@type": "Question",
              name: "PAYMENT COLLECTION PARTNER",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "The authorized payment collection partner for all online credit Credit / Debit Card / Net Banking Transactions of Pantone Online Store is Eshopbox Ecommerce Private Limited",
              },
          },
          {
              "@type": "Question",
              name: "CAN I BOOK AN ORDER FOR DELIVERY TO MORE THAN ONE ADDRESS?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "Each order is shipped only to a single address. If you wish to ship products to different addresses, you will have to place multiple orders.",
              },
          },
          {
              "@type": "Question",
              name: "ARE THE EXCHANGE AND RETURN POLICIES THE SAME FOR E-COMMERCE AND RETAIL PURCHASES?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Exchange & Return Policies for Pantone/ Urban e-commerce purchases are different from retail. Check our policies page for Retail purchases policy & E-commerce purchase policy",
              },
          },
          {
              "@type": "Question",
              name: "CAN I AVAIL ALTERATION SERVICES FOR Pantone GARMENTS AND ARE THEY CHARGEABLE?",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      "Pantone offers its customers a non-chargeable alteration service at all Exclusive Stores. This is a complimentary service that the customers can avail after presenting the invoice. It’s valid for both e-commerce and retail purchases.",
              },
          },
          {
              "@type": "Question",
              name: "SCREEN RESOLUTION",
              acceptedAnswer: {
                  "@type": "Answer",
                  text: "On your computer monitor, use a screen resolution of at least 1152 x 768 pixels for optimal presentation of the Pantone India Online Store.",
              },
          },
          {
              "@type": "Question",
              name: "BROWSER SETTINGS",
              acceptedAnswer: {
                  "@type": "Answer",
                  text:
                      'To ensure correct display and functioning of the Pantone Online Store, please use Internet Explorer Version 11, or Firefox Version 36 or Google Chrome 41. Java and JavaScript capabilities should be activated in the browser. The "Accept Cookies" function must be enabled in order to place products into the shopping basket. Given below are instructions on how to do this for some commonly used web browsers. Additional information can be found in your software manual or on the website of the browser provider. We recommend that you log off completely, when you finish using a computer that is shared and that has a browser set to accept cookies.',
              },
          },
      ],
  };
    this.contentSerive.faqdata().subscribe(content => {
      this.faqs = content;
      console.log("this.faq", this.faqs);
      this.seoService.setData(this.faqs);
      // this.title.setTitle("FAQs | Pantone");
    });
  }

    /**
   * on mouseover show/hide mega menu
   * @method showMegaMenu
   */
  public showMegaMenu(isHover: any, selectMenu: any = null, name) {
    // console.log(this.headerContent)
    // this.headerContent
    // this.showMenu = (isHover == true);
    // if (this.showMenu && selectMenu && selectMenu.itemName && (selectMenu.itemName == 'Men' 
    //   || selectMenu.itemName == 'Women' || selectMenu.itemName == 'Brands')) {
    //   return this.megaMenuSubMenu = selectMenu;
    // } else {
    //   return this.showMenu = false;
    // }
    this.showMenu = isHover;
    this.megaMenuSubMenu = selectMenu;
    this.hoverMenuName = name;
    console.log(isHover);
    console.log(selectMenu);
    console.log(name)

  }

}
