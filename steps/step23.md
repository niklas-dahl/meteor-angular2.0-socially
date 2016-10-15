[__prod__]: #
[{]: <region> (header)

[}]: #
[{]: <region> (body)
# Ionic

Ionic is a CSS and JavaScript framework. It is highly recommended that before starting this step you will get yourself familiar with its [documentation](http://ionicframework.com/docs/v2).

In this step we will learn how to add Ionic library into our project, and use its powerful directives to create cross platform mobile (Android & iOS) applications.

We will achieve this by creating separate views for web and for mobile  so be creating a separate view for the mobile applications, but we will keep the shared code parts as common code!

### Adding Ionic

Using ionic is pretty simple - first, we need to install it:

    $ meteor npm install ionic-angular --save

We also have to install missing packages that required by Ionic:

    $ meteor npm install @angular/http @angular/platform-server --save

### Separate web and mobile things

We are going to have two different `NgModule`s, because of the differences in the imports and declarations between the two platforms (web and Ionic).

We will also separate the main `Component` that in use.

So let's start with the `AppComponent` that needed to be change to `app.component.web.ts`, and it's template that ness to be called `app.component.web.html`.

Now update the usage of the template in the Component:

[{]: <helper> (diff_step 23.4)
#### Step 23.4: Updated the template import

##### Changed client/imports/app/app.component.web.ts
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊import { Component } from '@angular/core';
 ┊2┊2┊
-┊3┊ ┊import template from './app.component.html';
+┊ ┊3┊import template from './app.component.web.html';
 ┊4┊4┊import {InjectUser} from "angular2-meteor-accounts-ui";
 ┊5┊5┊
 ┊6┊6┊@Component({
```
[}]: #

And modify the import path in the module file:

[{]: <helper> (diff_step 23.5)
#### Step 23.5: Updated the main component import

##### Changed client/imports/app/app.module.ts
```diff
@@ -6,7 +6,7 @@
 ┊ 6┊ 6┊import { Ng2PaginationModule } from 'ng2-pagination';
 ┊ 7┊ 7┊import { AgmCoreModule } from 'angular2-google-maps/core';
 ┊ 8┊ 8┊
-┊ 9┊  ┊import { AppComponent } from './app.component';
+┊  ┊ 9┊import { AppComponent } from "./app.component.web";
 ┊10┊10┊import { routes, ROUTES_PROVIDERS } from './app.routes';
 ┊11┊11┊import { PARTIES_DECLARATIONS } from './parties';
 ┊12┊12┊import { SHARED_DECLARATIONS } from './shared';
```
[}]: #

Now let's take back the code we modified in the previous step (#21) and use only the original version of the Login component, because we do not want to have login in our Ionic version (it will be read only):

[{]: <helper> (diff_step 23.6)
#### Step 23.6: Use web version of Login component in routing

##### Changed client/imports/app/app.routes.ts
```diff
@@ -5,13 +5,12 @@
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 6┊ 6┊import {SignupComponent} from "./auth/singup.component";
 ┊ 7┊ 7┊import {RecoverComponent} from "./auth/recover.component";
-┊ 8┊  ┊import {MobileLoginComponent} from "./auth/login.component.mobile";
 ┊ 9┊ 8┊import {LoginComponent} from "./auth/login.component.web";
 ┊10┊ 9┊
 ┊11┊10┊export const routes: Route[] = [
 ┊12┊11┊  { path: '', component: PartiesListComponent },
 ┊13┊12┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
-┊14┊  ┊  { path: 'login', component: Meteor.isCordova ? MobileLoginComponent : LoginComponent },
+┊  ┊13┊  { path: 'login', component: LoginComponent },
 ┊15┊14┊  { path: 'signup', component: SignupComponent },
 ┊16┊15┊  { path: 'recover', component: RecoverComponent }
 ┊17┊16┊];
```
[}]: #

Create a root Component for the mobile, and call it `AppMobileComponent`:

[{]: <helper> (diff_step 23.7)
#### Step 23.7: Created the main mobile component

##### Added client/imports/app/mobile/app.component.mobile.ts
```diff
@@ -0,0 +1,13 @@
+┊  ┊ 1┊import {Component} from "@angular/core";
+┊  ┊ 2┊import template from "./app.component.mobile.html";
+┊  ┊ 3┊import {MenuController, Platform, App} from "ionic-angular";
+┊  ┊ 4┊
+┊  ┊ 5┊@Component({
+┊  ┊ 6┊  selector: "app",
+┊  ┊ 7┊  template
+┊  ┊ 8┊})
+┊  ┊ 9┊export class AppMobileComponent {
+┊  ┊10┊  constructor(app: App, platform: Platform, menu: MenuController) {
+┊  ┊11┊
+┊  ┊12┊  }
+┊  ┊13┊}🚫↵
```
[}]: #

And let's create it's view:

[{]: <helper> (diff_step 23.8)
#### Step 23.8: Created the main mobile component view

##### Added client/imports/app/mobile/app.component.mobile.html
```diff
@@ -0,0 +1 @@
+┊ ┊1┊<ion-nav [root]="rootPage" swipe-back-enabled="true"></ion-nav>🚫↵
```
[}]: #

We used `ion-nav` which is the navigation bar of Ionic, we also declared that our root page is `rootPage` which we will add later.

Now let's create an index file for the ionic component declarations:

[{]: <helper> (diff_step 23.9)
#### Step 23.9: Created index file for mobile declarations

##### Added client/imports/app/mobile/index.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import {AppMobileComponent} from "./app.component.mobile";
+┊ ┊2┊
+┊ ┊3┊export const MOBILE_DECLARATIONS = [
+┊ ┊4┊  AppMobileComponent
+┊ ┊5┊];🚫↵
```
[}]: #

## Modules Separation

In order to create two different versions of `NgModule` - one for each platform, we need to identify which platform are we running now - we already know how to do this from the previous step - we will use `Meteor.isCordova`.

We will have a single `NgModule` called `AppModule`, but it's declaration will be different according to the platform.

So we already know how the web module looks like, we just need to understand how mobile module defined when working with Ionic.

First - we need to import `IonicModule` and declare our root Component there.

We also need to declare `IonicApp` as our `bootstrap` Component, and add every Ionic `page` to the `entryComponents`.

So let's create it and differ the platform:

[{]: <helper> (diff_step 23.10)
#### Step 23.10: Imported mobile declarations and added conditional main component bootstrap

##### Changed client/imports/app/app.module.ts
```diff
@@ -19,38 +19,66 @@
 ┊19┊19┊import {MdListModule} from "@angular2-material/list";
 ┊20┊20┊import {AUTH_DECLARATIONS} from "./auth/index";
 ┊21┊21┊import {FileDropModule} from "angular2-file-drop";
+┊  ┊22┊import {MOBILE_DECLARATIONS} from "./mobile/index";
+┊  ┊23┊import {AppMobileComponent} from "./mobile/app.component.mobile";
+┊  ┊24┊import {IonicModule, IonicApp} from "ionic-angular";
 ┊22┊25┊
-┊23┊  ┊@NgModule({
-┊24┊  ┊  imports: [
-┊25┊  ┊    BrowserModule,
-┊26┊  ┊    FormsModule,
-┊27┊  ┊    ReactiveFormsModule,
-┊28┊  ┊    RouterModule.forRoot(routes),
-┊29┊  ┊    AccountsModule,
-┊30┊  ┊    Ng2PaginationModule,
-┊31┊  ┊    AgmCoreModule.forRoot({
-┊32┊  ┊      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
-┊33┊  ┊    }),
-┊34┊  ┊    MdCoreModule.forRoot(),
-┊35┊  ┊    MdButtonModule.forRoot(),
-┊36┊  ┊    MdToolbarModule.forRoot(),
-┊37┊  ┊    MdInputModule.forRoot(),
-┊38┊  ┊    MdCardModule.forRoot(),
-┊39┊  ┊    MdCheckboxModule.forRoot(),
-┊40┊  ┊    MdListModule.forRoot(),
-┊41┊  ┊    FileDropModule
-┊42┊  ┊  ],
-┊43┊  ┊  declarations: [
-┊44┊  ┊    AppComponent,
-┊45┊  ┊    ...PARTIES_DECLARATIONS,
-┊46┊  ┊    ...SHARED_DECLARATIONS,
-┊47┊  ┊    ...AUTH_DECLARATIONS
-┊48┊  ┊  ],
-┊49┊  ┊  providers: [
-┊50┊  ┊    ...ROUTES_PROVIDERS
-┊51┊  ┊  ],
-┊52┊  ┊  bootstrap: [
-┊53┊  ┊    AppComponent
-┊54┊  ┊  ]
-┊55┊  ┊})
+┊  ┊26┊let moduleDefinition;
+┊  ┊27┊
+┊  ┊28┊if (Meteor.isCordova) {
+┊  ┊29┊  moduleDefinition = {
+┊  ┊30┊    imports: [
+┊  ┊31┊      IonicModule.forRoot(AppMobileComponent)
+┊  ┊32┊    ],
+┊  ┊33┊    declarations: [
+┊  ┊34┊      ...SHARED_DECLARATIONS,
+┊  ┊35┊      ...MOBILE_DECLARATIONS
+┊  ┊36┊    ],
+┊  ┊37┊    providers: [
+┊  ┊38┊    ],
+┊  ┊39┊    bootstrap: [
+┊  ┊40┊      IonicApp
+┊  ┊41┊    ],
+┊  ┊42┊    entryComponents: [
+┊  ┊43┊      AppMobileComponent
+┊  ┊44┊    ]
+┊  ┊45┊  }
+┊  ┊46┊}
+┊  ┊47┊else {
+┊  ┊48┊  moduleDefinition = {
+┊  ┊49┊    imports: [
+┊  ┊50┊      BrowserModule,
+┊  ┊51┊      FormsModule,
+┊  ┊52┊      ReactiveFormsModule,
+┊  ┊53┊      RouterModule.forRoot(routes),
+┊  ┊54┊      AccountsModule,
+┊  ┊55┊      Ng2PaginationModule,
+┊  ┊56┊      AgmCoreModule.forRoot({
+┊  ┊57┊        apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
+┊  ┊58┊      }),
+┊  ┊59┊      MdCoreModule.forRoot(),
+┊  ┊60┊      MdButtonModule.forRoot(),
+┊  ┊61┊      MdToolbarModule.forRoot(),
+┊  ┊62┊      MdInputModule.forRoot(),
+┊  ┊63┊      MdCardModule.forRoot(),
+┊  ┊64┊      MdCheckboxModule.forRoot(),
+┊  ┊65┊      MdListModule.forRoot(),
+┊  ┊66┊      FileDropModule
+┊  ┊67┊    ],
+┊  ┊68┊    declarations: [
+┊  ┊69┊      AppComponent,
+┊  ┊70┊      ...PARTIES_DECLARATIONS,
+┊  ┊71┊      ...SHARED_DECLARATIONS,
+┊  ┊72┊      ...AUTH_DECLARATIONS
+┊  ┊73┊    ],
+┊  ┊74┊    providers: [
+┊  ┊75┊      ...ROUTES_PROVIDERS
+┊  ┊76┊    ],
+┊  ┊77┊    bootstrap: [
+┊  ┊78┊      AppComponent
+┊  ┊79┊    ]
+┊  ┊80┊  }
+┊  ┊81┊}
+┊  ┊82┊
+┊  ┊83┊@NgModule(moduleDefinition)
 ┊56┊84┊export class AppModule {}🚫↵
```
[}]: #

Our next step is to change our selector of the root Component.

As we already know, the root Component of the web platform uses `<app>` tag as the selector, but in our case the root Component has to be `IonicApp` that uses `<ion-app>` tag.

So we need to have the ability to switch `<app>` to `<ion-app>` when using mobile platform.

There is a package called `ionic-selector` we can use in order to get this done, so let's add it:

    $ meteor npm install --save ionic-selector

Now let's use in before bootstrapping our module:

[{]: <helper> (diff_step 23.12)
#### Step 23.12: Use ionic-selector package

##### Changed client/main.ts
```diff
@@ -6,7 +6,13 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import '../both/methods/parties.methods';
 ┊ 8┊ 8┊
+┊  ┊ 9┊import ionicSelector from 'ionic-selector';
+┊  ┊10┊
 ┊ 9┊11┊Meteor.startup(() => {
+┊  ┊12┊  if (Meteor.isCordova) {
+┊  ┊13┊    ionicSelector("app");
+┊  ┊14┊  }
+┊  ┊15┊
 ┊10┊16┊  const platform = platformBrowserDynamic();
 ┊11┊17┊  platform.bootstrapModule(AppModule);
 ┊12┊18┊});🚫↵
```
[}]: #

What it does? It's changing tag name of the main component (`app` by default but you can specify any selector you want) to `ion-app`.

An example:

```html
<body>
  <app class="main"></app>
</body>
```

will be changed to:

```html
<body>
  <ion-app class="main"></ion-app>
</body>
```

## Ionic styles & icons

Our next step is to load Ionic style and icons (called `ionicons`) only to the mobile platform.

Start by adding the icons package:

    $ meteor npm install --save ionicons

Also, let's create a style file for the mobile and Ionic styles, and load the icons package to it:

[{]: <helper> (diff_step 23.14)
#### Step 23.14: Create ionic.scss and add ionicons to it

##### Added client/imports/app/mobile/ionic.scss
```diff
@@ -0,0 +1 @@
+┊ ┊1┊@import "{}/node_modules/ionicons/dist/scss/ionicons";🚫↵
```
[}]: #

And let's imports this file into our main styles file:

[{]: <helper> (diff_step 23.15)
#### Step 23.15: Import ionic.scss to main file

##### Changed client/main.scss
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊@import "{}/node_modules/angular2-meteor-accounts-ui/build/login-buttons.scss";
+┊ ┊2┊@import "imports/app/mobile/ionic.scss";
 ┊2┊3┊
 ┊3┊4┊$color1 : #2F2933;
 ┊4┊5┊$color2 : #01A2A6;
```
[}]: #

Now we need to load Ionic stylesheet into our project - but we need to load it only to the mobile platform, without loading it to the web platform (otherwise, it will override our styles):

[{]: <helper> (diff_step 23.16)
#### Step 23.16: Imported the main css file of ionic

##### Changed client/imports/app/mobile/app.component.mobile.ts
```diff
@@ -2,6 +2,10 @@
 ┊ 2┊ 2┊import template from "./app.component.mobile.html";
 ┊ 3┊ 3┊import {MenuController, Platform, App} from "ionic-angular";
 ┊ 4┊ 4┊
+┊  ┊ 5┊if (Meteor.isCordova) {
+┊  ┊ 6┊  require("ionic-angular/css/ionic.css");
+┊  ┊ 7┊}
+┊  ┊ 8┊
 ┊ 5┊ 9┊@Component({
 ┊ 6┊10┊  selector: "app",
 ┊ 7┊11┊  template
```
[}]: #

We also need to add some CSS classes in order to get a good result:

[{]: <helper> (diff_step 23.17)
#### Step 23.17: Add two classes to fix an issue with overflow

##### Changed client/main.scss
```diff
@@ -22,6 +22,15 @@
 ┊22┊22┊  font-family: 'Muli', sans-serif;
 ┊23┊23┊}
 ┊24┊24┊
+┊  ┊25┊body.mobile {
+┊  ┊26┊  overflow: hidden;
+┊  ┊27┊}
+┊  ┊28┊
+┊  ┊29┊body.web {
+┊  ┊30┊  overflow: visible;
+┊  ┊31┊  position: initial;
+┊  ┊32┊}
+┊  ┊33┊
 ┊25┊34┊.sebm-google-map-container {
 ┊26┊35┊  width: 450px;
 ┊27┊36┊  height: 450px;
```
[}]: #

And let's add the correct class to the `body`:

[{]: <helper> (diff_step 23.18)
#### Step 23.18: Set the proper class on body

##### Changed client/main.ts
```diff
@@ -8,9 +8,20 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊import ionicSelector from 'ionic-selector';
 ┊10┊10┊
+┊  ┊11┊function setClass(css) {
+┊  ┊12┊  if (!document.body.className) {
+┊  ┊13┊    document.body.className = "";
+┊  ┊14┊  }
+┊  ┊15┊  document.body.className += " " + css;
+┊  ┊16┊}
+┊  ┊17┊
 ┊11┊18┊Meteor.startup(() => {
 ┊12┊19┊  if (Meteor.isCordova) {
 ┊13┊20┊    ionicSelector("app");
+┊  ┊21┊    setClass('mobile');
+┊  ┊22┊  }
+┊  ┊23┊  else {
+┊  ┊24┊    setClass('web');
 ┊14┊25┊  }
 ┊15┊26┊
 ┊16┊27┊  const platform = platformBrowserDynamic();
```
[}]: #

> We created a mechanism that adds `web` or `mobile` class to `<body/>` element depends on environment.

## Share logic between platforms

We want to share the logic of `PartiesListComponent` without sharing it's styles and template - because we want a different looks between the platforms.

In order to do so, let's take all of the logic we have in `PartiesListComponent` and take it to an external file that won't contain the Component decorator:

[{]: <helper> (diff_step 23.19)
#### Step 23.19: Take the logic of parties list to external class

##### Added client/imports/app/shared-components/parties-list.class.ts
```diff
@@ -0,0 +1,112 @@
+┊   ┊  1┊import {OnDestroy, OnInit} from "@angular/core";
+┊   ┊  2┊import {Observable, Subscription, Subject} from "rxjs";
+┊   ┊  3┊import {Party} from "../../../../both/models/party.model";
+┊   ┊  4┊import {PaginationService} from "ng2-pagination";
+┊   ┊  5┊import {MeteorObservable} from "meteor-rxjs";
+┊   ┊  6┊import {Parties} from "../../../../both/collections/parties.collection";
+┊   ┊  7┊import {Counts} from "meteor/tmeasday:publish-counts";
+┊   ┊  8┊import {InjectUser} from "angular2-meteor-accounts-ui";
+┊   ┊  9┊
+┊   ┊ 10┊interface Pagination {
+┊   ┊ 11┊  limit: number;
+┊   ┊ 12┊  skip: number;
+┊   ┊ 13┊}
+┊   ┊ 14┊
+┊   ┊ 15┊interface Options extends Pagination {
+┊   ┊ 16┊  [key: string]: any
+┊   ┊ 17┊}
+┊   ┊ 18┊
+┊   ┊ 19┊@InjectUser('user')
+┊   ┊ 20┊export class PartiesList implements OnInit, OnDestroy {
+┊   ┊ 21┊  parties: Observable<Party[]>;
+┊   ┊ 22┊  partiesSub: Subscription;
+┊   ┊ 23┊  pageSize: Subject<number> = new Subject<number>();
+┊   ┊ 24┊  curPage: Subject<number> = new Subject<number>();
+┊   ┊ 25┊  nameOrder: Subject<number> = new Subject<number>();
+┊   ┊ 26┊  optionsSub: Subscription;
+┊   ┊ 27┊  partiesSize: number = 0;
+┊   ┊ 28┊  autorunSub: Subscription;
+┊   ┊ 29┊  location: Subject<string> = new Subject<string>();
+┊   ┊ 30┊  user: Meteor.User;
+┊   ┊ 31┊  imagesSubs: Subscription;
+┊   ┊ 32┊
+┊   ┊ 33┊  constructor(private paginationService: PaginationService) {
+┊   ┊ 34┊
+┊   ┊ 35┊  }
+┊   ┊ 36┊
+┊   ┊ 37┊  ngOnInit() {
+┊   ┊ 38┊    this.optionsSub = Observable.combineLatest(
+┊   ┊ 39┊      this.pageSize,
+┊   ┊ 40┊      this.curPage,
+┊   ┊ 41┊      this.nameOrder,
+┊   ┊ 42┊      this.location
+┊   ┊ 43┊    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
+┊   ┊ 44┊      const options: Options = {
+┊   ┊ 45┊        limit: pageSize as number,
+┊   ┊ 46┊        skip: ((curPage as number) - 1) * (pageSize as number),
+┊   ┊ 47┊        sort: { name: nameOrder as number }
+┊   ┊ 48┊      };
+┊   ┊ 49┊
+┊   ┊ 50┊      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);
+┊   ┊ 51┊
+┊   ┊ 52┊      if (this.partiesSub) {
+┊   ┊ 53┊        this.partiesSub.unsubscribe();
+┊   ┊ 54┊      }
+┊   ┊ 55┊
+┊   ┊ 56┊      this.partiesSub = MeteorObservable.subscribe('parties', options, location).subscribe(() => {
+┊   ┊ 57┊        this.parties = Parties.find({}, {
+┊   ┊ 58┊          sort: {
+┊   ┊ 59┊            name: nameOrder
+┊   ┊ 60┊          }
+┊   ┊ 61┊        }).zone();
+┊   ┊ 62┊      });
+┊   ┊ 63┊    });
+┊   ┊ 64┊
+┊   ┊ 65┊    this.paginationService.register({
+┊   ┊ 66┊      id: this.paginationService.defaultId,
+┊   ┊ 67┊      itemsPerPage: 10,
+┊   ┊ 68┊      currentPage: 1,
+┊   ┊ 69┊      totalItems: this.partiesSize
+┊   ┊ 70┊    });
+┊   ┊ 71┊
+┊   ┊ 72┊    this.pageSize.next(10);
+┊   ┊ 73┊    this.curPage.next(1);
+┊   ┊ 74┊    this.nameOrder.next(1);
+┊   ┊ 75┊    this.location.next('');
+┊   ┊ 76┊
+┊   ┊ 77┊    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
+┊   ┊ 78┊      this.partiesSize = Counts.get('numberOfParties');
+┊   ┊ 79┊      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
+┊   ┊ 80┊    });
+┊   ┊ 81┊
+┊   ┊ 82┊    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
+┊   ┊ 83┊  }
+┊   ┊ 84┊
+┊   ┊ 85┊  removeParty(party: Party): void {
+┊   ┊ 86┊    Parties.remove(party._id);
+┊   ┊ 87┊  }
+┊   ┊ 88┊
+┊   ┊ 89┊  search(value: string): void {
+┊   ┊ 90┊    this.curPage.next(1);
+┊   ┊ 91┊    this.location.next(value);
+┊   ┊ 92┊  }
+┊   ┊ 93┊
+┊   ┊ 94┊  onPageChanged(page: number): void {
+┊   ┊ 95┊    this.curPage.next(page);
+┊   ┊ 96┊  }
+┊   ┊ 97┊
+┊   ┊ 98┊  changeSortOrder(nameOrder: string): void {
+┊   ┊ 99┊    this.nameOrder.next(parseInt(nameOrder));
+┊   ┊100┊  }
+┊   ┊101┊
+┊   ┊102┊  isOwner(party: Party): boolean {
+┊   ┊103┊    return this.user && this.user._id === party.owner;
+┊   ┊104┊  }
+┊   ┊105┊
+┊   ┊106┊  ngOnDestroy() {
+┊   ┊107┊    this.partiesSub.unsubscribe();
+┊   ┊108┊    this.optionsSub.unsubscribe();
+┊   ┊109┊    this.autorunSub.unsubscribe();
+┊   ┊110┊    this.imagesSubs.unsubscribe();
+┊   ┊111┊  }
+┊   ┊112┊}🚫↵
```
[}]: #

And let's clean up the `PartiesListComponent`, and use the new class `PartiesList` as base class for this Component:

[{]: <helper> (diff_step 23.20)
#### Step 23.20: Create a clean parties list for web display

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -1,123 +1,15 @@
-┊  1┊   ┊import { Component, OnInit, OnDestroy } from '@angular/core';
-┊  2┊   ┊import { Observable } from 'rxjs/Observable';
-┊  3┊   ┊import { Subject } from 'rxjs/Subject';
-┊  4┊   ┊import { Subscription } from 'rxjs/Subscription';
-┊  5┊   ┊import { MeteorObservable } from 'meteor-rxjs';
+┊   ┊  1┊import { Component } from '@angular/core';
 ┊  6┊  2┊import { PaginationService } from 'ng2-pagination';
-┊  7┊   ┊import { Counts } from 'meteor/tmeasday:publish-counts';
-┊  8┊   ┊import { InjectUser } from "angular2-meteor-accounts-ui";
-┊  9┊   ┊
-┊ 10┊   ┊import 'rxjs/add/operator/combineLatest';
-┊ 11┊   ┊
-┊ 12┊   ┊import { Parties } from '../../../../both/collections/parties.collection';
-┊ 13┊   ┊import { Party } from '../../../../both/models/party.model';
+┊   ┊  3┊import { PartiesList } from "../shared-components/parties-list.class";
 ┊ 14┊  4┊
 ┊ 15┊  5┊import template from './parties-list.component.html';
 ┊ 16┊  6┊
-┊ 17┊   ┊interface Pagination {
-┊ 18┊   ┊  limit: number;
-┊ 19┊   ┊  skip: number;
-┊ 20┊   ┊}
-┊ 21┊   ┊
-┊ 22┊   ┊interface Options extends Pagination {
-┊ 23┊   ┊  [key: string]: any
-┊ 24┊   ┊}
-┊ 25┊   ┊
 ┊ 26┊  7┊@Component({
 ┊ 27┊  8┊  selector: 'parties-list',
 ┊ 28┊  9┊  template
 ┊ 29┊ 10┊})
-┊ 30┊   ┊@InjectUser('user')
-┊ 31┊   ┊export class PartiesListComponent implements OnInit, OnDestroy {
-┊ 32┊   ┊  parties: Observable<Party[]>;
-┊ 33┊   ┊  partiesSub: Subscription;
-┊ 34┊   ┊  pageSize: Subject<number> = new Subject<number>();
-┊ 35┊   ┊  curPage: Subject<number> = new Subject<number>();
-┊ 36┊   ┊  nameOrder: Subject<number> = new Subject<number>();
-┊ 37┊   ┊  optionsSub: Subscription;
-┊ 38┊   ┊  partiesSize: number = 0;
-┊ 39┊   ┊  autorunSub: Subscription;
-┊ 40┊   ┊  location: Subject<string> = new Subject<string>();
-┊ 41┊   ┊  user: Meteor.User;
-┊ 42┊   ┊  imagesSubs: Subscription;
-┊ 43┊   ┊
-┊ 44┊   ┊  constructor(
-┊ 45┊   ┊    private paginationService: PaginationService
-┊ 46┊   ┊  ) {}
-┊ 47┊   ┊
-┊ 48┊   ┊  ngOnInit() {
-┊ 49┊   ┊    this.optionsSub = Observable.combineLatest(
-┊ 50┊   ┊      this.pageSize,
-┊ 51┊   ┊      this.curPage,
-┊ 52┊   ┊      this.nameOrder,
-┊ 53┊   ┊      this.location
-┊ 54┊   ┊    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
-┊ 55┊   ┊      const options: Options = {
-┊ 56┊   ┊        limit: pageSize as number,
-┊ 57┊   ┊        skip: ((curPage as number) - 1) * (pageSize as number),
-┊ 58┊   ┊        sort: { name: nameOrder as number }
-┊ 59┊   ┊      };
-┊ 60┊   ┊
-┊ 61┊   ┊      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);
-┊ 62┊   ┊
-┊ 63┊   ┊      if (this.partiesSub) {
-┊ 64┊   ┊        this.partiesSub.unsubscribe();
-┊ 65┊   ┊      }
-┊ 66┊   ┊      
-┊ 67┊   ┊      this.partiesSub = MeteorObservable.subscribe('parties', options, location).subscribe(() => {
-┊ 68┊   ┊        this.parties = Parties.find({}, {
-┊ 69┊   ┊          sort: {
-┊ 70┊   ┊            name: nameOrder
-┊ 71┊   ┊          }
-┊ 72┊   ┊        }).zone();
-┊ 73┊   ┊      });
-┊ 74┊   ┊    });
-┊ 75┊   ┊
-┊ 76┊   ┊    this.paginationService.register({
-┊ 77┊   ┊      id: this.paginationService.defaultId,
-┊ 78┊   ┊      itemsPerPage: 10,
-┊ 79┊   ┊      currentPage: 1,
-┊ 80┊   ┊      totalItems: this.partiesSize
-┊ 81┊   ┊    });
-┊ 82┊   ┊
-┊ 83┊   ┊    this.pageSize.next(10);
-┊ 84┊   ┊    this.curPage.next(1);
-┊ 85┊   ┊    this.nameOrder.next(1);
-┊ 86┊   ┊    this.location.next('');
-┊ 87┊   ┊
-┊ 88┊   ┊    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
-┊ 89┊   ┊      this.partiesSize = Counts.get('numberOfParties');
-┊ 90┊   ┊      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
-┊ 91┊   ┊    });
-┊ 92┊   ┊
-┊ 93┊   ┊    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
-┊ 94┊   ┊  }
-┊ 95┊   ┊
-┊ 96┊   ┊  removeParty(party: Party): void {
-┊ 97┊   ┊    Parties.remove(party._id);
-┊ 98┊   ┊  }
-┊ 99┊   ┊
-┊100┊   ┊  search(value: string): void {
-┊101┊   ┊    this.curPage.next(1);
-┊102┊   ┊    this.location.next(value);
-┊103┊   ┊  }
-┊104┊   ┊
-┊105┊   ┊  onPageChanged(page: number): void {
-┊106┊   ┊    this.curPage.next(page);
-┊107┊   ┊  }
-┊108┊   ┊
-┊109┊   ┊  changeSortOrder(nameOrder: string): void {
-┊110┊   ┊    this.nameOrder.next(parseInt(nameOrder));
-┊111┊   ┊  }
-┊112┊   ┊
-┊113┊   ┊  isOwner(party: Party): boolean {
-┊114┊   ┊    return this.user && this.user._id === party.owner;
-┊115┊   ┊  }
-┊116┊   ┊
-┊117┊   ┊  ngOnDestroy() {
-┊118┊   ┊    this.partiesSub.unsubscribe();
-┊119┊   ┊    this.optionsSub.unsubscribe();
-┊120┊   ┊    this.autorunSub.unsubscribe();
-┊121┊   ┊    this.imagesSubs.unsubscribe();
+┊   ┊ 11┊export class PartiesListComponent extends PartiesList {
+┊   ┊ 12┊  constructor(paginationService: PaginationService) {
+┊   ┊ 13┊    super(paginationService);
 ┊122┊ 14┊  }
 ┊123┊ 15┊}
```
[}]: #

Now let's create a basic view and layout for the mobile platform, be creating a new Component called `PartiesListMobile`, starting with the view:

[{]: <helper> (diff_step 23.21)
#### Step 23.21: Create a basic view of the mobile version

##### Added client/imports/app/mobile/parties-list.component.mobile.html
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊<ion-header>
+┊ ┊2┊  <ion-navbar>
+┊ ┊3┊    <ion-title>Socially</ion-title>
+┊ ┊4┊  </ion-navbar>
+┊ ┊5┊</ion-header>
+┊ ┊6┊<ion-content>
+┊ ┊7┊  Parties!
+┊ ┊8┊</ion-content>
```
[}]: #

And it's Component, which is very similar to the web version, only it uses different template:

[{]: <helper> (diff_step 23.22)
#### Step 23.22: Create the mobile version of PartiesList component

##### Added client/imports/app/mobile/parties-list.component.mobile.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import { PaginationService } from 'ng2-pagination';
+┊  ┊ 3┊import { PartiesList } from "../shared-components/parties-list.class";
+┊  ┊ 4┊
+┊  ┊ 5┊import template from './parties-list.component.mobile.html';
+┊  ┊ 6┊
+┊  ┊ 7┊@Component({
+┊  ┊ 8┊  selector: 'parties-list',
+┊  ┊ 9┊  template
+┊  ┊10┊})
+┊  ┊11┊export class PartiesListMobileComponent extends PartiesList {
+┊  ┊12┊  constructor(paginationService: PaginationService) {
+┊  ┊13┊    super(paginationService);
+┊  ┊14┊  }
+┊  ┊15┊}
```
[}]: #

Now let's add the mobile Component of the parties list to the index file:

[{]: <helper> (diff_step 23.23)
#### Step 23.23: Added PartiesListMobile component to the index file

##### Changed client/imports/app/mobile/index.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import {AppMobileComponent} from "./app.component.mobile";
+┊ ┊2┊import {PartiesListMobileComponent} from "./parties-list.component.mobile";
 ┊2┊3┊
 ┊3┊4┊export const MOBILE_DECLARATIONS = [
-┊4┊ ┊  AppMobileComponent
+┊ ┊5┊  AppMobileComponent,
+┊ ┊6┊  PartiesListMobileComponent
 ┊5┊7┊];🚫↵
```
[}]: #

And let's add the Component we just created as `rootPage` for our Ionic application:

[{]: <helper> (diff_step 23.24)
#### Step 23.24: Added the rootPage

##### Changed client/imports/app/mobile/app.component.mobile.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import {Component} from "@angular/core";
 ┊2┊2┊import template from "./app.component.mobile.html";
 ┊3┊3┊import {MenuController, Platform, App} from "ionic-angular";
+┊ ┊4┊import {PartiesListMobileComponent} from "./parties-list.component.mobile";
 ┊4┊5┊
 ┊5┊6┊if (Meteor.isCordova) {
 ┊6┊7┊  require("ionic-angular/css/ionic.css");
```
```diff
@@ -11,7 +12,9 @@
 ┊11┊12┊  template
 ┊12┊13┊})
 ┊13┊14┊export class AppMobileComponent {
-┊14┊  ┊  constructor(app: App, platform: Platform, menu: MenuController) {
+┊  ┊15┊  rootPage: any;
 ┊15┊16┊
+┊  ┊17┊  constructor(app: App, platform: Platform, menu: MenuController) {
+┊  ┊18┊    this.rootPage = PartiesListMobileComponent;
 ┊16┊19┊  }
 ┊17┊20┊}🚫↵
```
[}]: #

Now we just need declare this Component as `entryComponents` in the `NgModule` definition, and make sure we have all the required external modules in the `NgModule` that loaded for the mobile:

[{]: <helper> (diff_step 23.25)
#### Step 23.25: Update the module imports and entry point

##### Changed client/imports/app/app.module.ts
```diff
@@ -22,12 +22,14 @@
 ┊22┊22┊import {MOBILE_DECLARATIONS} from "./mobile/index";
 ┊23┊23┊import {AppMobileComponent} from "./mobile/app.component.mobile";
 ┊24┊24┊import {IonicModule, IonicApp} from "ionic-angular";
+┊  ┊25┊import {PartiesListMobileComponent} from "./mobile/parties-list.component.mobile";
 ┊25┊26┊
 ┊26┊27┊let moduleDefinition;
 ┊27┊28┊
 ┊28┊29┊if (Meteor.isCordova) {
 ┊29┊30┊  moduleDefinition = {
 ┊30┊31┊    imports: [
+┊  ┊32┊      Ng2PaginationModule,
 ┊31┊33┊      IonicModule.forRoot(AppMobileComponent)
 ┊32┊34┊    ],
 ┊33┊35┊    declarations: [
```
```diff
@@ -40,7 +42,7 @@
 ┊40┊42┊      IonicApp
 ┊41┊43┊    ],
 ┊42┊44┊    entryComponents: [
-┊43┊  ┊      AppMobileComponent
+┊  ┊45┊      PartiesListMobileComponent
 ┊44┊46┊    ]
 ┊45┊47┊  }
 ┊46┊48┊}
```
[}]: #

Now we want to add the actual view to the mobile Component, so let's do it:

[{]: <helper> (diff_step 23.26)
#### Step 23.26: Add name, description ad RSVPs to the view

##### Changed client/imports/app/mobile/parties-list.component.mobile.html
```diff
@@ -4,5 +4,28 @@
 ┊ 4┊ 4┊  </ion-navbar>
 ┊ 5┊ 5┊</ion-header>
 ┊ 6┊ 6┊<ion-content>
-┊ 7┊  ┊  Parties!
+┊  ┊ 7┊  <ion-card *ngFor="let party of parties | async">
+┊  ┊ 8┊    <ion-card-content>
+┊  ┊ 9┊      <ion-card-title>
+┊  ┊10┊        {{party.name}}
+┊  ┊11┊      </ion-card-title>
+┊  ┊12┊      <p>
+┊  ┊13┊        {{party.description}}
+┊  ┊14┊      </p>
+┊  ┊15┊    </ion-card-content>
+┊  ┊16┊
+┊  ┊17┊    <ion-row no-padding>
+┊  ┊18┊      <ion-col text-right>
+┊  ┊19┊        <ion-badge>
+┊  ┊20┊          yes {{party | rsvp:'yes'}}
+┊  ┊21┊        </ion-badge>
+┊  ┊22┊        <ion-badge item-center dark>
+┊  ┊23┊          maybe {{party | rsvp:'maybe'}}
+┊  ┊24┊        </ion-badge>
+┊  ┊25┊        <ion-badge item-center danger>
+┊  ┊26┊          no {{party | rsvp:'no'}}
+┊  ┊27┊        </ion-badge>
+┊  ┊28┊      </ion-col>
+┊  ┊29┊    </ion-row>
+┊  ┊30┊  </ion-card>
 ┊ 8┊31┊</ion-content>
```
[}]: #

> We used `ion-card` which is an Ionic Component.

And in order to have the ability to load images in the mobile platform, we need to add some logic to the `displayMainImage` Pipe, because Meteor's absolute URL is not the same in mobile:

[{]: <helper> (diff_step 23.27)
#### Step 23.27: Fix an issuewith a absolute path of an image

##### Changed client/imports/app/shared/display-main-image.pipe.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import {Pipe, PipeTransform} from '@angular/core';
 ┊2┊2┊import { Images } from '../../../../both/collections/images.collection';
 ┊3┊3┊import { Party } from '../../../../both/models/party.model';
+┊ ┊4┊import { Meteor } from "meteor/meteor";
 ┊4┊5┊
 ┊5┊6┊@Pipe({
 ┊6┊7┊  name: 'displayMainImage'
```
```diff
@@ -17,7 +18,12 @@
 ┊17┊18┊    const found = Images.findOne(imageId);
 ┊18┊19┊
 ┊19┊20┊    if (found) {
-┊20┊  ┊      imageUrl = found.url;
+┊  ┊21┊      if (!Meteor.isCordova) {
+┊  ┊22┊        imageUrl = found.url;
+┊  ┊23┊      } else {
+┊  ┊24┊        const path = `ufs/${found.store}/${found._id}/${found.name}`;
+┊  ┊25┊        imageUrl = Meteor.absoluteUrl(path);
+┊  ┊26┊      }
 ┊21┊27┊    }
 ┊22┊28┊
 ┊23┊29┊    return imageUrl;
```
[}]: #

And let's add the image to the view:

[{]: <helper> (diff_step 23.28)
#### Step 23.28: Use the main image pipe

##### Changed client/imports/app/mobile/parties-list.component.mobile.html
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊</ion-header>
 ┊ 6┊ 6┊<ion-content>
 ┊ 7┊ 7┊  <ion-card *ngFor="let party of parties | async">
+┊  ┊ 8┊    <img *ngIf="party.images" [src]="party | displayMainImage">
 ┊ 8┊ 9┊    <ion-card-content>
 ┊ 9┊10┊      <ion-card-title>
 ┊10┊11┊        {{party.name}}
```
[}]: #

### Fixing fonts

As you probably notice, there are many warnings about missing fonts. We can easily fix it with the help of a package called [`mys:fonts`](https://github.com/jellyjs/meteor-fonts).

    $ meteor add mys:fonts

That plugin needs to know which font we want to use and where it should be available.

Configuration is pretty easy, you will catch it by just looking on an example:

[{]: <helper> (diff_step 23.30)
#### Step 23.30: Define fonts.json

##### Added fonts.json
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊{
+┊ ┊2┊  "map": {
+┊ ┊3┊    "node_modules/ionic-angular/fonts/roboto-medium.ttf": "fonts/roboto-medium.ttf",
+┊ ┊4┊    "node_modules/ionic-angular/fonts/roboto-regular.ttf": "fonts/roboto-regular.ttf",
+┊ ┊5┊    "node_modules/ionic-angular/fonts/roboto-medium.woff": "fonts/roboto-medium.woff",
+┊ ┊6┊    "node_modules/ionic-angular/fonts/roboto-regular.woff": "fonts/roboto-regular.woff"
+┊ ┊7┊  }
+┊ ┊8┊}🚫↵
```
[}]: #

Now `roboto-regular.ttf` is available under `http://localhost:3000/fonts/roboto-regular.ttf`.

And... You have an app that works with Ionic!

## Summary

In this tutorial we showed how to use Ionic and how to separate the whole view for both, web and mobile.

We also learned how to share component between platforms, and change the view only!

We also used Ionic directives in order to provide user-experience of mobile platform instead of regular responsive layout of website.
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step22.md) | [Next Step >](step24.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #