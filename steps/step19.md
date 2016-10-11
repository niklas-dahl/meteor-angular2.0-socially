[__prod__]: #
[{]: <region> (header)

[}]: #
[{]: <region> (body)
# angular-material and custom Angular auth forms

In this chapter we will add angular2-material to our project, and update some style and layout in the project.

Angular2-material documentation of each component can be found [here](https://github.com/angular/material2/tree/master/src/components).

# Removing Bootstrap 4

First, let's remove our previous framework (Bootstrap) by running:

    $ meteor npm uninstall --save bootstrap

And let's remove the import from the `main.sass` file:

[{]: <helper> (diff_step 19.2)
#### Step 19.25: Added the recover route

##### Changed client/imports/app/app.routes.ts
```diff
@@ -5,12 +5,14 @@
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 6┊ 6┊import {LoginComponent} from "./auth/login.component";
 ┊ 7┊ 7┊import {SignupComponent} from "./auth/singup.component";
+┊  ┊ 8┊import {RecoverComponent} from "./auth/recover.component";
 ┊ 8┊ 9┊
 ┊ 9┊10┊export const routes: Route[] = [
 ┊10┊11┊  { path: '', component: PartiesListComponent },
 ┊11┊12┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
 ┊12┊13┊  { path: 'login', component: LoginComponent },
-┊13┊  ┊  { path: 'signup', component: SignupComponent }
+┊  ┊14┊  { path: 'signup', component: SignupComponent },
+┊  ┊15┊  { path: 'recover', component: RecoverComponent }
 ┊14┊16┊];
 ┊15┊17┊
 ┊16┊18┊export const ROUTES_PROVIDERS = [{
```
[}]: #

# Adding angular2-material

Now we need to add angular2-material to our project - so let's do that.

Run the following command in your Terminal:

    $ meteor npm install @angular2-material/core @angular2-material/button @angular2-material/card @angular2-material/checkbox @angular2-material/input @angular2-material/list @angular2-material/toolbar --save

We installed:

- core package
- button
- card
- checkbox
- input
- toolbar
- list

Now let's load the modules into our `NgModule`:

[{]: <helper> (diff_step 19.4)
#### Step 19.4: Imported the angular2-material modules

##### Changed client/imports/app/app.module.ts
```diff
@@ -10,6 +10,13 @@
 ┊10┊10┊import { routes, ROUTES_PROVIDERS } from './app.routes';
 ┊11┊11┊import { PARTIES_DECLARATIONS } from './parties';
 ┊12┊12┊import { SHARED_DECLARATIONS } from './shared';
+┊  ┊13┊import { MdButtonModule } from "@angular2-material/button";
+┊  ┊14┊import { MdToolbarModule } from "@angular2-material/toolbar";
+┊  ┊15┊import { MdInputModule } from "@angular2-material/input";
+┊  ┊16┊import { MdCardModule } from "@angular2-material/card";
+┊  ┊17┊import { MdCoreModule } from "@angular2-material/core";
+┊  ┊18┊import { MdCheckboxModule } from "@angular2-material/checkbox";
+┊  ┊19┊import {MdListModule} from "@angular2-material/list";
 ┊13┊20┊
 ┊14┊21┊@NgModule({
 ┊15┊22┊  imports: [
```
```diff
@@ -21,7 +28,14 @@
 ┊21┊28┊    Ng2PaginationModule,
 ┊22┊29┊    AgmCoreModule.forRoot({
 ┊23┊30┊      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
-┊24┊  ┊    })
+┊  ┊31┊    }),
+┊  ┊32┊    MdCoreModule.forRoot(),
+┊  ┊33┊    MdButtonModule.forRoot(),
+┊  ┊34┊    MdToolbarModule.forRoot(),
+┊  ┊35┊    MdInputModule.forRoot(),
+┊  ┊36┊    MdCardModule.forRoot(),
+┊  ┊37┊    MdCheckboxModule.forRoot(),
+┊  ┊38┊    MdListModule.forRoot()
 ┊25┊39┊  ],
 ┊26┊40┊  declarations: [
 ┊27┊41┊    AppComponent,
```
[}]: #

Like we did in the previous chapter - let's take care of the navigation bar first.

We use directives and components from Angular2-Material - such as `md-toolbar`.

Let's use it in the main component's template:

[{]: <helper> (diff_step 19.5)
#### Step 19.5: Change the nav bar and the layout

##### Changed client/imports/app/app.component.html
```diff
@@ -1,7 +1,6 @@
-┊1┊ ┊<nav class="navbar navbar-light bg-faded">
-┊2┊ ┊  <a class="navbar-brand" href="#">Socially</a>
-┊3┊ ┊  <login-buttons class="pull-right"></login-buttons>
-┊4┊ ┊</nav>
-┊5┊ ┊<div class="container-fluid">
-┊6┊ ┊  <router-outlet></router-outlet>
-┊7┊ ┊</div>🚫↵
+┊ ┊1┊<md-toolbar color="primary">
+┊ ┊2┊  <a routerLink="/" class="md-title">Socially</a>
+┊ ┊3┊  <span class="fill-remaining-space"></span>
+┊ ┊4┊  <login-buttons></login-buttons>
+┊ ┊5┊</md-toolbar>
+┊ ┊6┊<router-outlet></router-outlet>🚫↵
```
[}]: #

And let's add `.fill-remaining-space` CSS class:

[{]: <helper> (diff_step 19.6)
#### Step 19.6: Added the missing css

##### Changed client/main.scss
```diff
@@ -8,6 +8,10 @@
 ┊ 8┊ 8┊$color6 : #2F2933;
 ┊ 9┊ 9┊$color7 : #FF6F69;
 ┊10┊10┊
+┊  ┊11┊.fill-remaining-space {
+┊  ┊12┊  flex: 1 1 auto;
+┊  ┊13┊}
+┊  ┊14┊
 ┊11┊15┊html, body {
 ┊12┊16┊  height: 100%;
 ┊13┊17┊}
```
[}]: #

# PartiesForm component

Let's replace the `label` and the `input` with simply the `md-input` and `md-checkbox` and make the `button` look material:

[{]: <helper> (diff_step 19.7)
#### Step 19.7: Update the view of the parties form

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -1,21 +1,13 @@
-┊ 1┊  ┊<form [formGroup]="addForm" (ngSubmit)="addParty()" class="form-inline">
+┊  ┊ 1┊<form [formGroup]="addForm" (ngSubmit)="addParty()">
 ┊ 2┊ 2┊  <fieldset class="form-group">
-┊ 3┊  ┊    <label for="partyName">Party name</label>
-┊ 4┊  ┊    <input id="partyName" class="form-control" type="text" formControlName="name" placeholder="Party name" />
-┊ 5┊  ┊
-┊ 6┊  ┊    <label for="description">Description</label>
-┊ 7┊  ┊    <input id="description" class="form-control" type="text" formControlName="description" placeholder="Description">
-┊ 8┊  ┊
-┊ 9┊  ┊    <label for="location_name">Location</label>
-┊10┊  ┊    <input id="location_name" class="form-control" type="text" formControlName="location" placeholder="Location name">
+┊  ┊ 3┊    <md-input formControlName="name" placeholder="Party name"></md-input>
+┊  ┊ 4┊    <md-input formControlName="description" placeholder="Description"></md-input>
+┊  ┊ 5┊    <md-input formControlName="location" placeholder="Location name"></md-input>
 ┊11┊ 6┊
 ┊12┊ 7┊    <div class="checkbox">
-┊13┊  ┊      <label>
-┊14┊  ┊        <input type="checkbox" formControlName="public">
-┊15┊  ┊        Public
-┊16┊  ┊      </label>
+┊  ┊ 8┊      <md-checkbox formControlName="public">Public</md-checkbox>
 ┊17┊ 9┊    </div>
 ┊18┊10┊
-┊19┊  ┊    <button type="submit" class="btn btn-primary">Add</button>
+┊  ┊11┊    <button md-raised-button type="submit">Add</button>
 ┊20┊12┊  </fieldset>
-┊21┊  ┊</form>
+┊  ┊13┊</form>🚫↵
```
[}]: #

We use the `mdInput` component which is a wrapper for regular HTML input with style and cool layout.

# PartiesList component

PartiesForm component is done, so we can move one level higher in the component's tree. Time for the list of parties:

[{]: <helper> (diff_step 19.8)
#### Step 19.8: Change the layout of the parties list

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -1,88 +1,65 @@
-┊ 1┊  ┊<div class="row">
-┊ 2┊  ┊  <div class="col-md-12">
-┊ 3┊  ┊    <div class="jumbotron">
-┊ 4┊  ┊      <h3>Create a new party!</h3>
-┊ 5┊  ┊      <parties-form [hidden]="!user"></parties-form>
-┊ 6┊  ┊      <div [hidden]="user">You need to login to create new parties!</div>
-┊ 7┊  ┊    </div>
-┊ 8┊  ┊  </div>
-┊ 9┊  ┊</div>
-┊10┊  ┊<div class="row ma-filters">
-┊11┊  ┊  <div class="col-md-6">
-┊12┊  ┊    <h3>All Parties:</h3>
-┊13┊  ┊    <form class="form-inline">
-┊14┊  ┊      <input type="text" class="form-control" #searchtext placeholder="Search by Location">
-┊15┊  ┊      <button type="button" class="btn btn-primary" (click)="search(searchtext.value)">Search</button>
-┊16┊  ┊      Sort by name: <select class="form-control" #sort (change)="changeSortOrder(sort.value)">
-┊17┊  ┊      <option value="1" selected>Ascending</option>
-┊18┊  ┊      <option value="-1">Descending</option>
-┊19┊  ┊    </select>
-┊20┊  ┊    </form>
-┊21┊  ┊  </div>
-┊22┊  ┊</div>
-┊23┊  ┊<div class="row">
-┊24┊  ┊  <div class="col-md-6">
-┊25┊  ┊    <ul class="list-group">
-┊26┊  ┊      <li class="list-group-item">
-┊27┊  ┊        <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
-┊28┊  ┊      </li>
-┊29┊  ┊      <li *ngFor="let party of parties | async"
-┊30┊  ┊          class="list-group-item ma-party-item">
-┊31┊  ┊        <div class="row">
-┊32┊  ┊          <div class="col-sm-8">
-┊33┊  ┊            <h2 class="ma-party-name">
-┊34┊  ┊              <a [routerLink]="['/party', party._id]">{{party.name}}</a>
-┊35┊  ┊            </h2>
-┊36┊  ┊            @ {{party.location.name}}
-┊37┊  ┊            <p class="ma-party-description">
-┊38┊  ┊              {{party.description}}
-┊39┊  ┊            </p>
-┊40┊  ┊          </div>
-┊41┊  ┊          <div class="col-sm-4">
-┊42┊  ┊            <button class="btn btn-danger pull-right" [hidden]="!isOwner(party)" (click)="removeParty(party)"><i
-┊43┊  ┊              class="fa fa-times"></i></button>
-┊44┊  ┊          </div>
+┊  ┊ 1┊<div flex layout="row" class="div ma-parties-list">
+┊  ┊ 2┊  <div layout="row" flex>
+┊  ┊ 3┊    <div flex="50">
+┊  ┊ 4┊      <div>
+┊  ┊ 5┊        <div class="div new-party-form-container">
+┊  ┊ 6┊          <md-toolbar>
+┊  ┊ 7┊            <div class="md-toolbar-tools">
+┊  ┊ 8┊              <h3>Create a new party!</h3>
+┊  ┊ 9┊            </div>
+┊  ┊10┊          </md-toolbar>
+┊  ┊11┊          <parties-form [hidden]="!user"></parties-form>
+┊  ┊12┊          <div [hidden]="user">You need to login to create new parties!</div>
 ┊45┊13┊        </div>
-┊46┊  ┊        <div class="row ma-party-item-bottom">
-┊47┊  ┊          <div class="col-sm-4">
-┊48┊  ┊            <div class="ma-rsvp-sum">
-┊49┊  ┊              <div class="ma-rsvp-amount">
-┊50┊  ┊                <div class="ma-amount">
-┊51┊  ┊                  {{party | rsvp:'yes'}}
-┊52┊  ┊                </div>
-┊53┊  ┊                <div class="ma-rsvp-title">
-┊54┊  ┊                  YES
-┊55┊  ┊                </div>
-┊56┊  ┊              </div>
-┊57┊  ┊              <div class="ma-rsvp-amount">
-┊58┊  ┊                <div class="ma-amount">
-┊59┊  ┊                  {{party | rsvp:'maybe'}}
-┊60┊  ┊                </div>
-┊61┊  ┊                <div class="ma-rsvp-title">
-┊62┊  ┊                  MAYBE
-┊63┊  ┊                </div>
-┊64┊  ┊              </div>
-┊65┊  ┊              <div class="ma-rsvp-amount">
-┊66┊  ┊                <div class="ma-amount">
-┊67┊  ┊                  {{party | rsvp:'no'}}
-┊68┊  ┊                </div>
-┊69┊  ┊                <div class="ma-rsvp-title">
-┊70┊  ┊                  NO
+┊  ┊14┊        <div layout-padding layout="row">
+┊  ┊15┊          <md-input #searchtext placeholder="Search by Location"></md-input>
+┊  ┊16┊        </div>
+┊  ┊17┊        <div layout-padding layout="row">
+┊  ┊18┊          Sort by name:
+┊  ┊19┊          <select class="form-control" #sort (change)="changeSortOrder(sort.value)">
+┊  ┊20┊            <option value="1" selected>Ascending</option>
+┊  ┊21┊            <option value="-1">Descending</option>
+┊  ┊22┊          </select>
+┊  ┊23┊        </div>
+┊  ┊24┊
+┊  ┊25┊        <div class="div md-padding" style="padding-top:0;">
+┊  ┊26┊          <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
+┊  ┊27┊          <div *ngFor="let party of parties | async">
+┊  ┊28┊            <md-card>
+┊  ┊29┊              <md-card-content>
+┊  ┊30┊                <h2 class="md-title ma-name">
+┊  ┊31┊                  <a [routerLink]="['/party', party._id]">{{party.name}}</a>
+┊  ┊32┊                </h2>
+┊  ┊33┊                <p class="ma-description" style="padding:0 10px;margin-bottom:35px;margin-top: 6px;">
+┊  ┊34┊                  {{party.description}}
+┊  ┊35┊                </p>
+┊  ┊36┊                <div layout="row">
+┊  ┊37┊                  <div layout="row" layout-align="end end">
+┊  ┊38┊                    <div>
+┊  ┊39┊                      <div class="rsvps-sum">
+┊  ┊40┊                        <div class="rsvps-amount">{{party | rsvp:'yes'}}</div>
+┊  ┊41┊                        <div class="rsvps-title">Yes</div>
+┊  ┊42┊                      </div>
+┊  ┊43┊                      <div class="rsvps-sum">
+┊  ┊44┊                        <div class="rsvps-amount">{{party | rsvp:'maybe'}}</div>
+┊  ┊45┊                        <div class="rsvps-title">Maybe</div>
+┊  ┊46┊                      </div>
+┊  ┊47┊                      <div class="rsvps-sum">
+┊  ┊48┊                        <div class="rsvps-amount">{{party | rsvp:'no'}}</div>
+┊  ┊49┊                        <div class="rsvps-title">No</div>
+┊  ┊50┊                      </div>
+┊  ┊51┊                    </div>
+┊  ┊52┊                  </div>
 ┊71┊53┊                </div>
-┊72┊  ┊              </div>
-┊73┊  ┊            </div>
+┊  ┊54┊              </md-card-content>
+┊  ┊55┊            </md-card>
 ┊74┊56┊          </div>
 ┊75┊57┊        </div>
-┊76┊  ┊      </li>
-┊77┊  ┊      <li class="list-group-item">
-┊78┊  ┊        <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
-┊79┊  ┊      </li>
-┊80┊  ┊    </ul>
-┊81┊  ┊  </div>
-┊82┊  ┊  <div class="col-md-6">
-┊83┊  ┊    <ul class="list-group">
-┊84┊  ┊      <li class="list-group-item">
+┊  ┊58┊      </div>
+┊  ┊59┊      <div flex="50" layout="row" style="min-height:300px;">
 ┊85┊60┊        <sebm-google-map
+┊  ┊61┊          style="width: 100%; min-height:300px;"
+┊  ┊62┊          flex layout="row"
 ┊86┊63┊          [latitude]="0"
 ┊87┊64┊          [longitude]="0"
 ┊88┊65┊          [zoom]="1">
```
```diff
@@ -94,7 +71,7 @@
 ┊ 94┊ 71┊            </sebm-google-map-marker>
 ┊ 95┊ 72┊          </div>
 ┊ 96┊ 73┊        </sebm-google-map>
-┊ 97┊   ┊      </li>
-┊ 98┊   ┊    </ul>
+┊   ┊ 74┊      </div>
+┊   ┊ 75┊    </div>
 ┊ 99┊ 76┊  </div>
 ┊100┊ 77┊</div>🚫↵
```
[}]: #

To make it all look so much better, let's add couple of rules to css:

[{]: <helper> (diff_step 19.9)
#### Step 19.9: Add some style to the parties list

##### Changed client/imports/app/parties/parties-list.component.scss
```diff
@@ -1,125 +1,61 @@
-┊  1┊   ┊.ma-add-button-container {
-┊  2┊   ┊  button.btn {
-┊  3┊   ┊    background: $color3;
-┊  4┊   ┊    float: right;
-┊  5┊   ┊    margin-right: 5px;
-┊  6┊   ┊    outline: none;
-┊  7┊   ┊    i {
-┊  8┊   ┊      color: $color5;
-┊  9┊   ┊    }
-┊ 10┊   ┊  }
-┊ 11┊   ┊}
-┊ 12┊   ┊
-┊ 13┊   ┊.ma-parties-col {
-┊ 14┊   ┊  padding-top: 20px;
-┊ 15┊   ┊}
-┊ 16┊   ┊
-┊ 17┊   ┊.ma-filters {
-┊ 18┊   ┊  margin-bottom: 10px;
+┊   ┊  1┊.new-party-form-container {
+┊   ┊  2┊  margin: 20px;
+┊   ┊  3┊  border: 1px gainsboro solid;
 ┊ 19┊  4┊}
-┊ 20┊   ┊
-┊ 21┊   ┊.ma-party-item {
-┊ 22┊   ┊  .ma-party-name {
-┊ 23┊   ┊    margin-bottom: 20px;
-┊ 24┊   ┊    a {
-┊ 25┊   ┊      color: $color6;
-┊ 26┊   ┊      text-decoration: none !important;
-┊ 27┊   ┊      font-weight: 400;
-┊ 28┊   ┊    }
+┊   ┊  5┊.ma-parties-list {
+┊   ┊  6┊  .sebm-google-map {
+┊   ┊  7┊    box-sizing: border-box;
+┊   ┊  8┊    -webkit-flex: 1;
+┊   ┊  9┊    -ms-flex: 1;
+┊   ┊ 10┊    flex: 1;
+┊   ┊ 11┊    -webkit-flex-direction: row;
+┊   ┊ 12┊    -ms-flex-direction: row;
+┊   ┊ 13┊    flex-direction: row;
+┊   ┊ 14┊    box-sizing: border-box;
+┊   ┊ 15┊    display: -webkit-flex;
+┊   ┊ 16┊    display: -ms-flexbox;
+┊   ┊ 17┊    display: flex;
 ┊ 29┊ 18┊  }
-┊ 30┊   ┊  .ma-party-description {
-┊ 31┊   ┊    color: $color6;
-┊ 32┊   ┊    font-weight: 300;
-┊ 33┊   ┊    padding-left: 18px;
-┊ 34┊   ┊    font-size: 14px;
+┊   ┊ 19┊
+┊   ┊ 20┊  .angular-google-map-container {
+┊   ┊ 21┊    box-sizing: border-box;
+┊   ┊ 22┊    -webkit-flex: 1;
+┊   ┊ 23┊    -ms-flex: 1;
+┊   ┊ 24┊    flex: 1;
 ┊ 35┊ 25┊  }
 ┊ 36┊ 26┊
-┊ 37┊   ┊  .ma-remove {
-┊ 38┊   ┊    color: lighten($color7, 20%);
-┊ 39┊   ┊    position: absolute;
-┊ 40┊   ┊    right: 20px;
-┊ 41┊   ┊    top: 20px;
-┊ 42┊   ┊    &:hover {
-┊ 43┊   ┊      color: $color7;
+┊   ┊ 27┊  .rsvps-sum {
+┊   ┊ 28┊    display: inline-block;
+┊   ┊ 29┊    width: 50px;
+┊   ┊ 30┊    text-align: center;
+┊   ┊ 31┊    .rsvps-amount {
+┊   ┊ 32┊      font-size: 24px;
+┊   ┊ 33┊    }
+┊   ┊ 34┊    .rsvps-title {
+┊   ┊ 35┊      font-size: 13px;
+┊   ┊ 36┊      color: #aaa;
 ┊ 44┊ 37┊    }
 ┊ 45┊ 38┊  }
 ┊ 46┊ 39┊
-┊ 47┊   ┊  .ma-party-item-bottom {
-┊ 48┊   ┊    padding-top: 10px;
-┊ 49┊   ┊    .ma-posted-by-col {
-┊ 50┊   ┊      .ma-posted-by {
-┊ 51┊   ┊        color: darken($color4, 30%);
-┊ 52┊   ┊        font-size: 12px;
-┊ 53┊   ┊      }
-┊ 54┊   ┊      .ma-everyone-invited {
-┊ 55┊   ┊        @media (max-width: 400px) {
-┊ 56┊   ┊          display: block;
-┊ 57┊   ┊          i {
-┊ 58┊   ┊            margin-left: 0px !important;
-┊ 59┊   ┊          }
-┊ 60┊   ┊        }
-┊ 61┊   ┊        font-size: 12px;
-┊ 62┊   ┊        color: darken($color4, 10%);
-┊ 63┊   ┊        i {
-┊ 64┊   ┊          color: darken($color4, 10%);
-┊ 65┊   ┊          margin-left: 5px;
-┊ 66┊   ┊        }
-┊ 67┊   ┊      }
+┊   ┊ 40┊  .ma-party {
+┊   ┊ 41┊    .party-image {
+┊   ┊ 42┊      background-size: cover;
+┊   ┊ 43┊      width: 100%;
+┊   ┊ 44┊      height: 200px;
 ┊ 68┊ 45┊    }
 ┊ 69┊ 46┊
-┊ 70┊   ┊    .ma-rsvp-buttons {
-┊ 71┊   ┊      input.btn {
-┊ 72┊   ┊        color: darken($color3, 20%);
-┊ 73┊   ┊        background: transparent !important;
-┊ 74┊   ┊        outline: none;
-┊ 75┊   ┊        padding-left: 0;
-┊ 76┊   ┊        &:active {
-┊ 77┊   ┊          box-shadow: none;
-┊ 78┊   ┊        }
-┊ 79┊   ┊        &:hover {
-┊ 80┊   ┊          color: darken($color3, 30%);
-┊ 81┊   ┊        }
-┊ 82┊   ┊        &.btn-primary {
-┊ 83┊   ┊          color: lighten($color3, 10%);
-┊ 84┊   ┊          border: 0;
-┊ 85┊   ┊          background: transparent !important;
-┊ 86┊   ┊        }
+┊   ┊ 47┊    .ma-name {
+┊   ┊ 48┊      a {
+┊   ┊ 49┊        text-decoration: none;
+┊   ┊ 50┊        color: #333;
 ┊ 87┊ 51┊      }
 ┊ 88┊ 52┊    }
+┊   ┊ 53┊    .ma-description {
 ┊ 89┊ 54┊
-┊ 90┊   ┊    .ma-rsvp-sum {
-┊ 91┊   ┊      width: 160px;
-┊ 92┊   ┊      @media (min-width: 400px) {
-┊ 93┊   ┊        float: right;
-┊ 94┊   ┊      }
-┊ 95┊   ┊      @media (max-width: 400px) {
-┊ 96┊   ┊        margin: 0 auto;
-┊ 97┊   ┊      }
-┊ 98┊   ┊    }
-┊ 99┊   ┊    .ma-rsvp-amount {
-┊100┊   ┊      display: inline-block;
-┊101┊   ┊      text-align: center;
-┊102┊   ┊      width: 50px;
-┊103┊   ┊      .ma-amount {
-┊104┊   ┊        font-weight: bold;
-┊105┊   ┊        font-size: 20px;
-┊106┊   ┊      }
-┊107┊   ┊      .ma-rsvp-title {
-┊108┊   ┊        font-size: 11px;
-┊109┊   ┊        color: #aaa;
-┊110┊   ┊        text-transform: uppercase;
-┊111┊   ┊      }
 ┊112┊ 55┊    }
 ┊113┊ 56┊  }
 ┊114┊ 57┊}
 ┊115┊ 58┊
-┊116┊   ┊.ma-angular-map-col {
-┊117┊   ┊  .angular-google-map-container, .angular-google-map {
-┊118┊   ┊    height: 100%;
-┊119┊   ┊    width: 100%;
-┊120┊   ┊  }
-┊121┊   ┊}
-┊122┊   ┊
 ┊123┊ 59┊.search-form {
 ┊124┊ 60┊  margin-bottom: 1em;
 ┊125┊ 61┊}🚫↵
```
[}]: #

# PartyDetails component

We also need to update the PartyDetails component:

[{]: <helper> (diff_step 19.10)
#### Step 19.10: Update the layout of the party details

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -1,61 +1,50 @@
-┊ 1┊  ┊<div class="row ma-party-details-container">
-┊ 2┊  ┊  <div class="col-sm-6 col-sm-offset-3">
-┊ 3┊  ┊    <legend>View and Edit Your Party Details:</legend>
-┊ 4┊  ┊    <form class="form-horizontal" *ngIf="party" (submit)="saveParty()">
-┊ 5┊  ┊      <div class="form-group">
-┊ 6┊  ┊        <label>Party Name</label>
-┊ 7┊  ┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.name" name="name" class="form-control">
-┊ 8┊  ┊      </div>
-┊ 9┊  ┊
-┊10┊  ┊      <div class="form-group">
-┊11┊  ┊        <label>Description</label>
-┊12┊  ┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.description" name="description" class="form-control">
-┊13┊  ┊      </div>
-┊14┊  ┊
-┊15┊  ┊      <div class="form-group">
+┊  ┊ 1┊<div layout="row" flex class="ma-party-details">
+┊  ┊ 2┊  <div flex="33" offset="33">
+┊  ┊ 3┊    <div class="md-content new-party-form-container">
+┊  ┊ 4┊      <md-toolbar>
+┊  ┊ 5┊        <div class="md-toolbar-tools">
+┊  ┊ 6┊          <h3>Your party details:</h3>
+┊  ┊ 7┊        </div>
+┊  ┊ 8┊      </md-toolbar>
+┊  ┊ 9┊      <form layout="column" *ngIf="party" (submit)="saveParty()">
+┊  ┊10┊        <label>Party Name: </label>
+┊  ┊11┊        <md-input [disabled]="!isOwner" [(ngModel)]="party.name" name="name"></md-input>
+┊  ┊12┊        <label>Party Description</label>
+┊  ┊13┊        <md-input [disabled]="!isOwner" [(ngModel)]="party.description" name="description"></md-input>
 ┊16┊14┊        <label>Location name</label>
-┊17┊  ┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.location.name" name="location" class="form-control">
-┊18┊  ┊      </div>
-┊19┊  ┊
-┊20┊  ┊      <div class="form-group">
-┊21┊  ┊        <button [disabled]="!isOwner" type="submit" class="btn btn-primary">Save</button>
-┊22┊  ┊        <a [routerLink]="['/']" class="btn">Back</a>
-┊23┊  ┊      </div>
-┊24┊  ┊    </form>
+┊  ┊15┊        <md-input [disabled]="!isOwner" [(ngModel)]="party.location.name" name="location"></md-input>
+┊  ┊16┊        <md-checkbox [disabled]="!isOwner" [(checked)]="party.public" name="public" aria-label="Public">
+┊  ┊17┊          Is public
+┊  ┊18┊        </md-checkbox>
 ┊25┊19┊
-┊26┊  ┊    <ul class="ma-invite-list" *ngIf="isOwner || isPublic">
-┊27┊  ┊      <h3>
-┊28┊  ┊        Users to invite:
-┊29┊  ┊      </h3>
-┊30┊  ┊      <li *ngFor="let user of users | async">
-┊31┊  ┊        <div>{{ user | displayName }}</div>
-┊32┊  ┊        <button (click)="invite(user)" class="btn btn-primary btn-sm">Invite</button>
-┊33┊  ┊      </li>
-┊34┊  ┊    </ul>
-┊35┊  ┊
-┊36┊  ┊    <div *ngIf="isInvited">
-┊37┊  ┊      <h2>Reply to the invitation</h2>
-┊38┊  ┊      <input type="button" class="btn btn-primary" value="I'm going!" (click)="reply('yes')">
-┊39┊  ┊      <input type="button" class="btn btn-warning" value="Maybe" (click)="reply('maybe')">
-┊40┊  ┊      <input type="button" class="btn btn-danger" value="No" (click)="reply('no')">
-┊41┊  ┊    </div>
+┊  ┊20┊        <div layout="row" layout-align="left">
+┊  ┊21┊          <button [disabled]="!isOwner" type="submit" md-raised-button class="md-raised md-primary">Save</button>
+┊  ┊22┊          <a [routerLink]="['/']" md-raised-button class="md-raised">Back</a>
+┊  ┊23┊        </div>
 ┊42┊24┊
-┊43┊  ┊    <h3 class="ma-map-title">
-┊44┊  ┊      Click the map to set the party location
-┊45┊  ┊    </h3>
+┊  ┊25┊        <md-list>
+┊  ┊26┊          <div class="md-no-sticky">Users to invite:</div>
+┊  ┊27┊          <md-list-item *ngFor="let user of users | async">
+┊  ┊28┊            <div>{{ user | displayName }}</div>
+┊  ┊29┊            <button (click)="invite(user)" md-raised-button class="md-raised">Invite</button>
+┊  ┊30┊          </md-list-item>
+┊  ┊31┊        </md-list>
 ┊46┊32┊
-┊47┊  ┊    <div class="angular-google-map-container">
-┊48┊  ┊      <sebm-google-map
-┊49┊  ┊        [latitude]="lat || centerLat"
-┊50┊  ┊        [longitude]="lng || centerLng"
-┊51┊  ┊        [zoom]="8"
-┊52┊  ┊        (mapClick)="mapClicked($event)">
-┊53┊  ┊        <sebm-google-map-marker
-┊54┊  ┊          *ngIf="lat && lng"
-┊55┊  ┊          [latitude]="lat"
-┊56┊  ┊          [longitude]="lng">
-┊57┊  ┊        </sebm-google-map-marker>
-┊58┊  ┊      </sebm-google-map>
+┊  ┊33┊        <div class="angular-google-map-container">
+┊  ┊34┊          <sebm-google-map
+┊  ┊35┊            style="height: 300px;"
+┊  ┊36┊            [latitude]="lat || centerLat"
+┊  ┊37┊            [longitude]="lng || centerLng"
+┊  ┊38┊            [zoom]="8"
+┊  ┊39┊            (mapClick)="mapClicked($event)">
+┊  ┊40┊            <sebm-google-map-marker
+┊  ┊41┊              *ngIf="lat && lng"
+┊  ┊42┊              [latitude]="lat"
+┊  ┊43┊              [longitude]="lng">
+┊  ┊44┊            </sebm-google-map-marker>
+┊  ┊45┊          </sebm-google-map>
+┊  ┊46┊        </div>
+┊  ┊47┊      </form>
 ┊59┊48┊    </div>
 ┊60┊49┊  </div>
 ┊61┊50┊</div>🚫↵
```
[}]: #

# Custom Authentication Components

Our next step will replace the `login-buttons` which is a simple and non-styled login/signup component - we will add our custom authentication component with custom style.

First, let's remove the login-buttons from the navigation bar, and replace it with custom buttons for Login / Signup / Logout.

We will also add `routerLink` to each button, and add logic to hide/show buttons according to the user's login state:

[{]: <helper> (diff_step 19.11)
#### Step 19.11: Replace login buttons with custom buttons

##### Changed client/imports/app/app.component.html
```diff
@@ -1,6 +1,13 @@
 ┊ 1┊ 1┊<md-toolbar color="primary">
 ┊ 2┊ 2┊  <a routerLink="/" class="md-title">Socially</a>
 ┊ 3┊ 3┊  <span class="fill-remaining-space"></span>
-┊ 4┊  ┊  <login-buttons></login-buttons>
+┊  ┊ 4┊  <div [hidden]="user">
+┊  ┊ 5┊    <a md-button [routerLink]="['/login']" >Login</a>
+┊  ┊ 6┊    <a md-button [routerLink]="['/signup']">Sign up</a>
+┊  ┊ 7┊  </div>
+┊  ┊ 8┊  <div [hidden]="!user">
+┊  ┊ 9┊    <span>{{ user | displayName }}</span>
+┊  ┊10┊    <button md-button (click)="logout()">Logout</button>
+┊  ┊11┊  </div>
 ┊ 5┊12┊</md-toolbar>
 ┊ 6┊13┊<router-outlet></router-outlet>🚫↵
```
[}]: #

Let's use `InjectUser` decorator, just like we did in one of the previous chapters.

[{]: <helper> (diff_step 19.12)
#### Step 19.12: Add auth logic to the App component

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,9 +1,19 @@
 ┊ 1┊ 1┊import { Component } from '@angular/core';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './app.component.html';
+┊  ┊ 4┊import {InjectUser} from "angular2-meteor-accounts-ui";
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊@Component({
 ┊ 6┊ 7┊  selector: 'app',
 ┊ 7┊ 8┊  template
 ┊ 8┊ 9┊})
-┊ 9┊  ┊export class AppComponent {}
+┊  ┊10┊@InjectUser('user')
+┊  ┊11┊export class AppComponent {
+┊  ┊12┊  constructor() {
+┊  ┊13┊
+┊  ┊14┊  }
+┊  ┊15┊
+┊  ┊16┊  logout() {
+┊  ┊17┊    Meteor.logout();
+┊  ┊18┊  }
+┊  ┊19┊}
```
[}]: #

As you can see, we used `DisplayNamePipe` in the view so we have to import it.

We also implemented `logout()` method with `Meteor.logout()`. It is, like you probably guessed, to log out the current user.

Now we can move on to create three new components.

### Login component

First component, is to log in user to the app.

We will need a form and the login method, so let's implement them:

[{]: <helper> (diff_step 19.13)
#### Step 19.13: Create LoginComponent

##### Added client/imports/app/auth/login.component.ts
```diff
@@ -0,0 +1,40 @@
+┊  ┊ 1┊import {Component, OnInit, NgZone} from '@angular/core';
+┊  ┊ 2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
+┊  ┊ 3┊import { Router } from '@angular/router';
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './login.component.html';
+┊  ┊ 7┊
+┊  ┊ 8┊@Component({
+┊  ┊ 9┊  selector: 'login',
+┊  ┊10┊  template
+┊  ┊11┊})
+┊  ┊12┊export class LoginComponent implements OnInit {
+┊  ┊13┊  loginForm: FormGroup;
+┊  ┊14┊  error: string;
+┊  ┊15┊
+┊  ┊16┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
+┊  ┊17┊
+┊  ┊18┊  ngOnInit() {
+┊  ┊19┊    this.loginForm = this.formBuilder.group({
+┊  ┊20┊      email: ['', Validators.required],
+┊  ┊21┊      password: ['', Validators.required]
+┊  ┊22┊    });
+┊  ┊23┊
+┊  ┊24┊    this.error = '';
+┊  ┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  login() {
+┊  ┊28┊    if (this.loginForm.valid) {
+┊  ┊29┊      Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
+┊  ┊30┊        if (err) {
+┊  ┊31┊          this.zone.run(() => {
+┊  ┊32┊            this.error = err;
+┊  ┊33┊          });
+┊  ┊34┊        } else {
+┊  ┊35┊          this.router.navigate(['/']);
+┊  ┊36┊        }
+┊  ┊37┊      });
+┊  ┊38┊    }
+┊  ┊39┊  }
+┊  ┊40┊}🚫↵
```
[}]: #

> Notice that we used `NgZone` in our constructor in order to get it from the Dependency Injection, and we used it before we update the result of the login action - we need to do this because the Meteor world does not update Angular's world, and we need to tell Angular when to update the view since the async result of the login action comes from Meteor's context.

You previously created a form by yourself so there's no need to explain the whole process once again.

About the login method.

Meteor's accounts system has a method called `loginWithPassword`, you can read more about it [here](http://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword).

We need to provide two values, a email and a password. We could get them from the form.

In the callback of Meteor.loginWithPassword's method, we have the redirection to the homepage on success and we're saving the error message if login process failed.

Let's add the view:

[{]: <helper> (diff_step 19.14)
#### Step 19.14: Create a template for LoginComponent

##### Added client/imports/app/auth/login.component.html
```diff
@@ -0,0 +1,37 @@
+┊  ┊ 1┊<div class="md-content" layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <div layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary" color="primary">
+┊  ┊ 4┊      Sign in
+┊  ┊ 5┊    </md-toolbar>
+┊  ┊ 6┊
+┊  ┊ 7┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊ 8┊      <div layout="row" layout-fill layout-margin>
+┊  ┊ 9┊        <p class="md-body-2"> Sign in with your email</p>
+┊  ┊10┊      </div>
+┊  ┊11┊
+┊  ┊12┊      <form [formGroup]="loginForm" #f="ngForm" (ngSubmit)="login()"
+┊  ┊13┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊14┊
+┊  ┊15┊        <md-input formControlName="email" type="email" placeholder="Email"></md-input>
+┊  ┊16┊        <md-input formControlName="password" type="password" placeholder="Password"></md-input>
+┊  ┊17┊
+┊  ┊18┊        <div layout="row" layout-align="space-between center">
+┊  ┊19┊          <a md-button [routerLink]="['/recover']">Forgot password?</a>
+┊  ┊20┊          <button md-raised-button class="md-primary" type="submit" aria-label="login">Sign In</button>
+┊  ┊21┊        </div>
+┊  ┊22┊      </form>
+┊  ┊23┊
+┊  ┊24┊      <div [hidden]="error == ''">
+┊  ┊25┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊26┊          <p class="md-body-1">{{ error }}</p>
+┊  ┊27┊        </md-toolbar>
+┊  ┊28┊      </div>
+┊  ┊29┊
+┊  ┊30┊      <md-divider></md-divider>
+┊  ┊31┊
+┊  ┊32┊      <div layout="row" layout-align="center">
+┊  ┊33┊        <a md-button [routerLink]="['/signup']">Need an account?</a>
+┊  ┊34┊      </div>
+┊  ┊35┊    </div>
+┊  ┊36┊  </div>
+┊  ┊37┊</div>🚫↵
```
[}]: #

We also need to define the `/login` route:

[{]: <helper> (diff_step 19.15)
#### Step 19.15: Add the login route

##### Changed client/imports/app/app.routes.ts
```diff
@@ -3,10 +3,12 @@
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊import { PartiesListComponent } from './parties/parties-list.component';
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
+┊  ┊ 6┊import {LoginComponent} from "./auth/login.component";
 ┊ 6┊ 7┊
 ┊ 7┊ 8┊export const routes: Route[] = [
 ┊ 8┊ 9┊  { path: '', component: PartiesListComponent },
-┊ 9┊  ┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] }
+┊  ┊10┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
+┊  ┊11┊  { path: 'login', component: LoginComponent }
 ┊10┊12┊];
 ┊11┊13┊
 ┊12┊14┊export const ROUTES_PROVIDERS = [{
```
[}]: #

And now let's create an index file for the auth files:

[{]: <helper> (diff_step 19.16)
#### Step 19.16: Create the index file for auth component

##### Added client/imports/app/auth/index.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import {LoginComponent} from "./login.component";
+┊ ┊2┊
+┊ ┊3┊export const AUTH_DECLARATIONS = [
+┊ ┊4┊  LoginComponent
+┊ ┊5┊];
```
[}]: #

And import the exposed Array into the `NgModule`:

[{]: <helper> (diff_step 19.17)
#### Step 19.17: Updated the NgModule imports

##### Changed client/imports/app/app.module.ts
```diff
@@ -17,6 +17,7 @@
 ┊17┊17┊import { MdCoreModule } from "@angular2-material/core";
 ┊18┊18┊import { MdCheckboxModule } from "@angular2-material/checkbox";
 ┊19┊19┊import {MdListModule} from "@angular2-material/list";
+┊  ┊20┊import {AUTH_DECLARATIONS} from "./auth/index";
 ┊20┊21┊
 ┊21┊22┊@NgModule({
 ┊22┊23┊  imports: [
```
```diff
@@ -40,7 +41,8 @@
 ┊40┊41┊  declarations: [
 ┊41┊42┊    AppComponent,
 ┊42┊43┊    ...PARTIES_DECLARATIONS,
-┊43┊  ┊    ...SHARED_DECLARATIONS
+┊  ┊44┊    ...SHARED_DECLARATIONS,
+┊  ┊45┊    ...AUTH_DECLARATIONS
 ┊44┊46┊  ],
 ┊45┊47┊  providers: [
 ┊46┊48┊    ...ROUTES_PROVIDERS
```
[}]: #

### Signup component

The Signup component looks pretty much the same as the Login component. We just use different method, `Accounts.createUser()`. Here's [the link](http://docs.meteor.com/api/passwords.html#Accounts-createUser) to the documentation.

[{]: <helper> (diff_step 19.18)
#### Step 19.18: Added the signup component

##### Added client/imports/app/auth/singup.component.ts
```diff
@@ -0,0 +1,43 @@
+┊  ┊ 1┊import {Component, OnInit, NgZone} from '@angular/core';
+┊  ┊ 2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
+┊  ┊ 3┊import { Router } from '@angular/router';
+┊  ┊ 4┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './signup.component.html';
+┊  ┊ 7┊
+┊  ┊ 8┊@Component({
+┊  ┊ 9┊  selector: 'signup',
+┊  ┊10┊  template
+┊  ┊11┊})
+┊  ┊12┊export class SignupComponent implements OnInit {
+┊  ┊13┊  signupForm: FormGroup;
+┊  ┊14┊  error: string;
+┊  ┊15┊
+┊  ┊16┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
+┊  ┊17┊
+┊  ┊18┊  ngOnInit() {
+┊  ┊19┊    this.signupForm = this.formBuilder.group({
+┊  ┊20┊      email: ['', Validators.required],
+┊  ┊21┊      password: ['', Validators.required]
+┊  ┊22┊    });
+┊  ┊23┊
+┊  ┊24┊    this.error = '';
+┊  ┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  signup() {
+┊  ┊28┊    if (this.signupForm.valid) {
+┊  ┊29┊      Accounts.createUser({
+┊  ┊30┊        email: this.signupForm.value.email,
+┊  ┊31┊        password: this.signupForm.value.password
+┊  ┊32┊      }, (err) => {
+┊  ┊33┊        if (err) {
+┊  ┊34┊          this.zone.run(() => {
+┊  ┊35┊            this.error = err;
+┊  ┊36┊          });
+┊  ┊37┊        } else {
+┊  ┊38┊          this.router.navigate(['/']);
+┊  ┊39┊        }
+┊  ┊40┊      });
+┊  ┊41┊    }
+┊  ┊42┊  }
+┊  ┊43┊}🚫↵
```
[}]: #

And the view:

[{]: <helper> (diff_step 19.19)
#### Step 19.19: Added the signup view

##### Added client/imports/app/auth/signup.component.html
```diff
@@ -0,0 +1,32 @@
+┊  ┊ 1┊<div class="md-content" layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <div layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary" color="primary">
+┊  ┊ 4┊      Sign up
+┊  ┊ 5┊    </md-toolbar>
+┊  ┊ 6┊
+┊  ┊ 7┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊ 8┊      <form [formGroup]="signupForm" #f="ngForm" (ngSubmit)="signup()"
+┊  ┊ 9┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊10┊
+┊  ┊11┊        <md-input formControlName="email" type="email" placeholder="Email"></md-input>
+┊  ┊12┊        <md-input formControlName="password" type="password" placeholder="Password"></md-input>
+┊  ┊13┊
+┊  ┊14┊        <div layout="row" layout-align="space-between center">
+┊  ┊15┊          <button md-raised-button class="md-primary" type="submit" aria-label="login">Sign Up</button>
+┊  ┊16┊        </div>
+┊  ┊17┊      </form>
+┊  ┊18┊
+┊  ┊19┊      <div [hidden]="error == ''">
+┊  ┊20┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊21┊          <p class="md-body-1">{{ error }}</p>
+┊  ┊22┊        </md-toolbar>
+┊  ┊23┊      </div>
+┊  ┊24┊
+┊  ┊25┊      <md-divider></md-divider>
+┊  ┊26┊
+┊  ┊27┊      <div layout="row" layout-align="center">
+┊  ┊28┊        <a md-button [routerLink]="['/login']">Already a user?</a>
+┊  ┊29┊      </div>
+┊  ┊30┊    </div>
+┊  ┊31┊  </div>
+┊  ┊32┊</div>🚫↵
```
[}]: #

And add it to the index file:

[{]: <helper> (diff_step 19.20)
#### Step 19.20: Added signup component to the index file

##### Changed client/imports/app/auth/index.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import {LoginComponent} from "./login.component";
+┊ ┊2┊import {SignupComponent} from "./singup.component";
 ┊2┊3┊
 ┊3┊4┊export const AUTH_DECLARATIONS = [
-┊4┊ ┊  LoginComponent
+┊ ┊5┊  LoginComponent,
+┊ ┊6┊  SignupComponent
 ┊5┊7┊];
```
[}]: #

And the `/signup` route:

[{]: <helper> (diff_step 19.21)
#### Step 19.21: Added signup route

##### Changed client/imports/app/app.routes.ts
```diff
@@ -4,11 +4,13 @@
 ┊ 4┊ 4┊import { PartiesListComponent } from './parties/parties-list.component';
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 6┊ 6┊import {LoginComponent} from "./auth/login.component";
+┊  ┊ 7┊import {SignupComponent} from "./auth/singup.component";
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊export const routes: Route[] = [
 ┊ 9┊10┊  { path: '', component: PartiesListComponent },
 ┊10┊11┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
-┊11┊  ┊  { path: 'login', component: LoginComponent }
+┊  ┊12┊  { path: 'login', component: LoginComponent },
+┊  ┊13┊  { path: 'signup', component: SignupComponent }
 ┊12┊14┊];
 ┊13┊15┊
 ┊14┊16┊export const ROUTES_PROVIDERS = [{
```
[}]: #

### Recover component

This component is helfup when a user forgets his password. We'll use `Accounts.forgotPassword` method:

[{]: <helper> (diff_step 19.22)
#### Step 19.22: Create the recover component

##### Added client/imports/app/auth/recover.component.ts
```diff
@@ -0,0 +1,41 @@
+┊  ┊ 1┊import {Component, OnInit, NgZone} from '@angular/core';
+┊  ┊ 2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
+┊  ┊ 3┊import { Router } from '@angular/router';
+┊  ┊ 4┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './recover.component.html';
+┊  ┊ 7┊
+┊  ┊ 8┊@Component({
+┊  ┊ 9┊  selector: 'recover',
+┊  ┊10┊  template
+┊  ┊11┊})
+┊  ┊12┊export class RecoverComponent implements OnInit {
+┊  ┊13┊  recoverForm: FormGroup;
+┊  ┊14┊  error: string;
+┊  ┊15┊
+┊  ┊16┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
+┊  ┊17┊
+┊  ┊18┊  ngOnInit() {
+┊  ┊19┊    this.recoverForm = this.formBuilder.group({
+┊  ┊20┊      email: ['', Validators.required]
+┊  ┊21┊    });
+┊  ┊22┊
+┊  ┊23┊    this.error = '';
+┊  ┊24┊  }
+┊  ┊25┊
+┊  ┊26┊  recover() {
+┊  ┊27┊    if (this.recoverForm.valid) {
+┊  ┊28┊      Accounts.forgotPassword({
+┊  ┊29┊        email: this.recoverForm.value.email
+┊  ┊30┊      }, (err) => {
+┊  ┊31┊        if (err) {
+┊  ┊32┊          this.zone.run(() => {
+┊  ┊33┊            this.error = err;
+┊  ┊34┊          });
+┊  ┊35┊        } else {
+┊  ┊36┊          this.router.navigate(['/']);
+┊  ┊37┊        }
+┊  ┊38┊      });
+┊  ┊39┊    }
+┊  ┊40┊  }
+┊  ┊41┊}🚫↵
```
[}]: #

Create the view:

[{]: <helper> (diff_step 19.23)
#### Step 19.23: Create the recover component view

##### Added client/imports/app/auth/recover.component.html
```diff
@@ -0,0 +1,31 @@
+┊  ┊ 1┊<div class="md-content" layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <div layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary" color="primary">
+┊  ┊ 4┊      Recover Your Password
+┊  ┊ 5┊    </md-toolbar>
+┊  ┊ 6┊
+┊  ┊ 7┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊ 8┊      <form [formGroup]="recoverForm" #f="ngForm" (ngSubmit)="recover()"
+┊  ┊ 9┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊10┊
+┊  ┊11┊        <md-input formControlName="email" type="email" placeholder="Email"></md-input>
+┊  ┊12┊
+┊  ┊13┊        <div layout="row" layout-align="space-between center">
+┊  ┊14┊          <button md-raised-button class="md-primary" type="submit" aria-label="Recover">Recover</button>
+┊  ┊15┊        </div>
+┊  ┊16┊      </form>
+┊  ┊17┊
+┊  ┊18┊      <div [hidden]="error == ''">
+┊  ┊19┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊20┊          <p class="md-body-1">{{ error }}</p>
+┊  ┊21┊        </md-toolbar>
+┊  ┊22┊      </div>
+┊  ┊23┊
+┊  ┊24┊      <md-divider></md-divider>
+┊  ┊25┊
+┊  ┊26┊      <div layout="row" layout-align="center">
+┊  ┊27┊        <a md-button [routerLink]="['/login']">Remember your password?</a>
+┊  ┊28┊      </div>
+┊  ┊29┊    </div>
+┊  ┊30┊  </div>
+┊  ┊31┊</divt>🚫↵
```
[}]: #

And add it to the index file:

[{]: <helper> (diff_step 19.24)
#### Step 19.24: Added the recover component to the index file

##### Changed client/imports/app/auth/index.ts
```diff
@@ -1,7 +1,9 @@
 ┊1┊1┊import {LoginComponent} from "./login.component";
 ┊2┊2┊import {SignupComponent} from "./singup.component";
+┊ ┊3┊import {RecoverComponent} from "./recover.component";
 ┊3┊4┊
 ┊4┊5┊export const AUTH_DECLARATIONS = [
 ┊5┊6┊  LoginComponent,
-┊6┊ ┊  SignupComponent
+┊ ┊7┊  SignupComponent,
+┊ ┊8┊  RecoverComponent
 ┊7┊9┊];
```
[}]: #

And add the `/reset` route:

[{]: <helper> (diff_step 19.25)
#### Step 19.25: Added the recover route

##### Changed client/imports/app/app.routes.ts
```diff
@@ -5,12 +5,14 @@
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 6┊ 6┊import {LoginComponent} from "./auth/login.component";
 ┊ 7┊ 7┊import {SignupComponent} from "./auth/singup.component";
+┊  ┊ 8┊import {RecoverComponent} from "./auth/recover.component";
 ┊ 8┊ 9┊
 ┊ 9┊10┊export const routes: Route[] = [
 ┊10┊11┊  { path: '', component: PartiesListComponent },
 ┊11┊12┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
 ┊12┊13┊  { path: 'login', component: LoginComponent },
-┊13┊  ┊  { path: 'signup', component: SignupComponent }
+┊  ┊14┊  { path: 'signup', component: SignupComponent },
+┊  ┊15┊  { path: 'recover', component: RecoverComponent }
 ┊14┊16┊];
 ┊15┊17┊
 ┊16┊18┊export const ROUTES_PROVIDERS = [{
```
[}]: #

That's it! we just implemented our own authentication components using Meteor's Accounts API and Angular2-Material!

# Summary

In this chapter we replaced Boostrap4 with Angular2-Material, and updated all the view and layout to match the component we got from it.

We also learnt how to use Meteor's Accounts API and how to implement authentication view and components, and how to connect them to our app.
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step18.md) | [Next Step >](step20.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #