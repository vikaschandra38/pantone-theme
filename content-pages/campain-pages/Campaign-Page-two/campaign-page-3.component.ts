import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { mobile, isDesktop } from '@env/environment';

@Component({
  selector: 'app-campaign-page',
  templateUrl: isDesktop
  ? "./campaign-page-3.component.html"
  : "./campaign-page-3.component.html",
styleUrls: isDesktop
  ? ["./campaign-page-3.component.css"]
  : ["./campaign-page-3.component.css"]
  // templateUrl: './campaign-page.component.html',
  // styleUrls: ['./campaign-page.component.css']
})
export class CampaignPageThreeComponent implements OnInit {

  constructor(public title: Title) { 
    this.title.setTitle('Campaign | Pantone');

  }

  ngOnInit() {
  }

}
