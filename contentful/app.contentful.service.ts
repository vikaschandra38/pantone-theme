import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import * as contentful from "contentful";
import * as bbcontentful from "contentful";
import { from } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ContentfulService {
  // private DukeIndia = contentful.createClient({
  //   space: environment.contentful.spaceId,
  //   accessToken: environment.contentful.token
  // });
  private ContentfulData = contentful.createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.token
  });
  constructor() {}
  // // Duke data
  // DukeIndiaContent(contentId) {
  //   this.DukeIndia.getEntry(contentId).then(entry => entry);
  // }
  // // single entry
  // logDukeContent(contentId) {
  //   this.DukeIndia.getEntry(contentId).then(entry => entry);
  // }
  // logDukeAllContents(contentId) {
  //   this.DukeIndia.getEntries(contentId).then(entries => entries);
  // }
  // getDukeAllAssets() {
  //   this.DukeIndia.getAssets().then(assets => assets);
  // }
  // getDukeContent(contentId) {
  //   const promise = this.DukeIndia.getEntry(contentId);
  //   const observ = from(promise).pipe(map(entry => entry.fields));
  //   return observ;
  // }
  // consoleDukeEntries() {
  //   this.DukeIndia.getEntries({
  //     limit: 1000,
  //     select: "fields.mainCategories",
  //     content_type: "menu"
  //   }).then(entries => entries);
  // }
  // consoleDukeEntry(contentId, level) {
  //   this.DukeIndia.getEntry(contentId, {
  //     include: level
  //   }).then(entry => entry);
  // }
  // getDukeEntry(contentId, level): Promise<any> {
  //   const promise = this.DukeIndia.getEntry(contentId, {
  //     include: level
  //   });
  //   const data = promise.then(entry => entry.fields);
  //   return data;
  // }

  // ContentfulData data
  bbIndiaContent(contentId) {
    this.ContentfulData.getEntry(contentId).then(entry => entry);
  }
  // single entry
  logbbContent(contentId) {
    this.ContentfulData.getEntry(contentId).then(entry => entry);
  }
  logbbAllContents(contentId) {
    this.ContentfulData.getEntries(contentId).then(entries => entries);
  }
  getbbAllAssets() {
    this.ContentfulData.getAssets().then(assets => assets);
  }
  getbbContent(contentId) {
    const promise = this.ContentfulData.getEntry(contentId);
    const observ = from(promise).pipe(map(entry => entry.fields));
    return observ;
  }
  consolebbEntries() {
    this.ContentfulData.getEntries({
      limit: 1000,
      select: "fields.mainCategories",
      content_type: "menu"
    }).then(entries => entries);
  }
  consolebbEntry(contentId, level) {
    this.ContentfulData.getEntry(contentId, {
      include: level
    }).then(entry => entry);
  }
  getEntry(contentId, level): Promise<any> {
    const promise = this.ContentfulData.getEntry(contentId, {
      include: level
    });
    const data = promise.then(entry => entry.fields);
    return data;
  }
}
