import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { mobile, isDesktop } from '@env/environment';

@Component({
  selector: 'app-campaign-page',
  templateUrl: isDesktop
  ? "./campaign-page-two.component.html"
  : "./campaign-page-two.component.html",
styleUrls: isDesktop
  ? ["./campaign-page-two.component.css"]
  : ["./campaign-page-two.component.css"]
  // templateUrl: './campaign-page.component.html',
  // styleUrls: ['./campaign-page.component.css']
})
export class CampaignPageTwoComponent implements OnInit {

  constructor(public title: Title) { 
    this.title.setTitle('Campaign | Pantone');

  }

  ngOnInit() {
  }

}
