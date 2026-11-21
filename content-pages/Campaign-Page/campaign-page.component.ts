import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { mobile, isDesktop } from '@env/environment';

@Component({
  selector: 'app-campaign-page',
  templateUrl: isDesktop
  ? "./campaign-page.component.html"
  : "./campaign-page.component.mobile.html",
styleUrls: isDesktop
  ? ["./campaign-page.component.css"]
  : ["./campaign-page.component.mobile.css"]
  // templateUrl: './campaign-page.component.html',
  // styleUrls: ['./campaign-page.component.css']
})
export class CampaignPageComponent implements OnInit {

  constructor(public title: Title) { 
    this.title.setTitle('Campaign | Pantone');

  }

  ngOnInit() {
  }

}
