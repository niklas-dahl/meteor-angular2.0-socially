import {Component} from "@angular/core";
import template from "./app.component.mobile.html";
import {MenuController, Platform, App} from "ionic-angular";

if (Meteor.isCordova) {
  require("ionic-angular/css/ionic.css");
}

@Component({
  selector: "app",
  template
})
export class AppMobileComponent {
  constructor(app: App, platform: Platform, menu: MenuController) {

  }
}