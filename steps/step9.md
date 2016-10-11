[__prod__]: #
[{]: <region> (header)

[}]: #
[{]: <region> (body)
# User accounts, authentication and permissions

In this section we'll look at how to:

- implement security for an app using Meteor and Angular 2 API
- setup user accounts in meteor using a login and password
- setup OAuth login for Facebook & Twitter
- restrict access to views based on user permissions

# Removing Insecure

Right now, our app is publishing all parties to all clients, allowing any client to change those parties. The changes are then reflected back to all the other clients automatically.

This is super powerful and easy, but what about security?  We don't want any user to be able to change any party...

For quick and easy setup, Meteor automatically includes a package called `insecure`. As the name implies, the packages provides a default behavior to Meteor collections allowing all reads and writes.

The first thing we should do is to remove the "insecure" package. By removing that package, the default behavior is changed to deny all.

Execute this command in the command line:

    $ meteor remove insecure
    > insecure removed from your project

Let's try to change the parties array or a specific party. Nothing's working.

That's because now we have to write an explicit security rule for each operation we want to make on the Mongo collection.

We can assume we will allow a user to alter data if any of the following are true:

- the user is logged in
- the user created the party
- the user is an admin

# User Accounts

One of Meteor's most powerful packages is the [Meteor accounts](https://www.meteor.com/accounts) system.

Add the "accounts-password" Meteor package. It's a very powerful package for all the user operations you can think of: login, signup, change password, password recovery, email confirmation and more.

    $ meteor add accounts-password

Now we are going to add `angular2-meteor-accounts-ui` which is a package that contains all the HTML and CSS we need for the user operation forms.

    $ meteor npm install --save angular2-meteor-accounts-ui

Because Angular 2 works with modules, we need to import this package's module into our:

[{]: <helper> (diff_step 9.2)
#### Step 9.2: Import AccountsModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import { BrowserModule } from '@angular/platform-browser';
 ┊3┊3┊import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 ┊4┊4┊import { RouterModule } from '@angular/router';
+┊ ┊5┊import { AccountsModule } from 'angular2-meteor-accounts-ui';
 ┊5┊6┊
 ┊6┊7┊import { AppComponent } from './app.component';
 ┊7┊8┊import { routes } from './app.routes';
```
```diff
@@ -12,7 +13,8 @@
 ┊12┊13┊    BrowserModule,
 ┊13┊14┊    FormsModule,
 ┊14┊15┊    ReactiveFormsModule,
-┊15┊  ┊    RouterModule.forRoot(routes)
+┊  ┊16┊    RouterModule.forRoot(routes),
+┊  ┊17┊    AccountsModule
 ┊16┊18┊  ],
 ┊17┊19┊  declarations: [
 ┊18┊20┊    AppComponent,
```
[}]: #

Let's add the `<login-buttons>` tag below of the party form in the PartiesList's template:

[{]: <helper> (diff_step 9.3)
#### Step 9.3: Use LoginButtons component

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊<div>
 ┊2┊2┊  <parties-form></parties-form>
+┊ ┊3┊  <login-buttons></login-buttons>
 ┊3┊4┊
 ┊4┊5┊  <ul>
 ┊5┊6┊    <li *ngFor="let party of parties | async">
```
[}]: #

Now let's create main stylesheet file (with `.scss` extension), and import the SCSS file from the package:

[{]: <helper> (diff_step 9.4)
#### Step 9.4: Import styles

##### Added client/main.scss
```diff
@@ -0,0 +1 @@
+┊ ┊1┊@import "{}/node_modules/angular2-meteor-accounts-ui/build/login-buttons.scss";🚫↵
```
[}]: #

Run the code, you'll see a login link below the form. Click on the link and then "create  account" to sign up. Try to log in and log out.

That's it! As you can see, it's very easy to add basic login support with the help of the Meteor accounts package.

## Parties.allow()

Now that we have our account system, we can start defining our security rules for the parties.

Let's go to the "collection" folder and specify what actions are allowed:

[{]: <helper> (diff_step 9.5)
#### Step 9.5: Add Parties collection security

##### Changed both/collections/parties.collection.ts
```diff
@@ -1,5 +1,16 @@
 ┊ 1┊ 1┊import { MongoObservable } from 'meteor-rxjs';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊import { Party } from '../models/party.model';
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊export const Parties = new MongoObservable.Collection<Party>('parties');
+┊  ┊ 7┊
+┊  ┊ 8┊function loggedIn() {
+┊  ┊ 9┊  return !!Meteor.user();
+┊  ┊10┊}
+┊  ┊11┊
+┊  ┊12┊Parties.allow({
+┊  ┊13┊  insert: loggedIn,
+┊  ┊14┊  update: loggedIn,
+┊  ┊15┊  remove: loggedIn
+┊  ┊16┊});
```
[}]: #

In only 10 lines of code we've specified that inserts, updates and removes can only be completed if a user is logged in.

The callbacks passed to the Parties.allow are executed on the server only. The client optimistically assumes that any action (such as removal of a party) will succeed, and reverts the action as soon as the server denies permission.
If you want to learn more about those parameters passed into Parties.allow or how this method works in general, please, read the official Meteor [docs on allow](http://docs.meteor.com/#/full/allow).

## Meteor.user()

Let's work on ensuring only the party creator (owner) can change the party data.

First we must define an owner for each party that gets created. We do this by taking our current user's ID and setting it as the owner ID of the created party.

Meteor's base accounts package provides two reactive functions that we are going to
use, [`Meteor.user()`](http://docs.meteor.com/#/full/meteor_user) and [`Meteor.userId()`](http://docs.meteor.com/#/full/meteor_users).

For now, we are going to keep it simple in this app and allow every logged-in user to change a party.
It'd be useful to add an alert prompting the user to log in if she wants to add or update a party.

Change the click handler of the "Add" button in the `parties-form.component.ts`, `addParty`:

[{]: <helper> (diff_step 9.6)
#### Step 9.6: Check access in PartiesForm

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Component, OnInit } from '@angular/core';
 ┊2┊2┊import { FormGroup, FormBuilder, Validators } from '@angular/forms';
+┊ ┊3┊import { Meteor } from 'meteor/meteor';
 ┊3┊4┊
 ┊4┊5┊import { Parties } from '../../../../both/collections/parties.collection';
 ┊5┊6┊
```
```diff
@@ -25,6 +26,11 @@
 ┊25┊26┊  }
 ┊26┊27┊
 ┊27┊28┊  addParty(): void {
+┊  ┊29┊    if (!Meteor.userId()) {
+┊  ┊30┊      alert('Please log in to add a party');
+┊  ┊31┊      return;
+┊  ┊32┊    }
+┊  ┊33┊
 ┊28┊34┊    if (this.addForm.valid) {
 ┊29┊35┊      Parties.insert(this.addForm.value);
```
[}]: #

Now, change it to save the user ID as well:

[{]: <helper> (diff_step 9.7)
#### Step 9.7: Add owner

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -32,7 +32,7 @@
 ┊32┊32┊    }
 ┊33┊33┊
 ┊34┊34┊    if (this.addForm.valid) {
-┊35┊  ┊      Parties.insert(this.addForm.value);
+┊  ┊35┊      Parties.insert(Object.assign({}, this.addForm.value, { owner: Meteor.userId() }));
 ┊36┊36┊
 ┊37┊37┊      this.addForm.reset();
 ┊38┊38┊    }
```
[}]: #

Notice that you'll need to update the Party interface in the `party.interface.ts` definition file with the optional new property: `owner?: string`:

[{]: <helper> (diff_step 9.8)
#### Step 9.8: Define owner in Party type

##### Changed both/models/party.model.ts
```diff
@@ -4,4 +4,5 @@
 ┊4┊4┊  name: string;
 ┊5┊5┊  description: string;
 ┊6┊6┊  location: string;
+┊ ┊7┊  owner?: string; 
 ┊7┊8┊}
```
[}]: #

Let's verify the same logic for updating a party:

[{]: <helper> (diff_step 9.9)
#### Step 9.9: Check access to update a party

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import { Component, OnInit, OnDestroy } from '@angular/core';
 ┊2┊2┊import { ActivatedRoute } from '@angular/router';
-┊3┊ ┊import { Subscription } from 'rxjs/Subscription'; 
+┊ ┊3┊import { Subscription } from 'rxjs/Subscription';
+┊ ┊4┊import { Meteor } from 'meteor/meteor'; 
 ┊4┊5┊
 ┊5┊6┊import 'rxjs/add/operator/map';
 ┊6┊7┊
```
```diff
@@ -33,6 +34,11 @@
 ┊33┊34┊  }
 ┊34┊35┊
 ┊35┊36┊  saveParty() {
+┊  ┊37┊    if (!Meteor.userId()) {
+┊  ┊38┊      alert('Please log in to change this party');
+┊  ┊39┊      return;
+┊  ┊40┊    }
+┊  ┊41┊    
 ┊36┊42┊    Parties.update(this.party._id, {
 ┊37┊43┊      $set: {
 ┊38┊44┊        name: this.party.name,
```
[}]: #

# canActivate

`CanActivate` is a one of three guard types in the new router. It decides if a route can be activated.

Now you can specify if a component can be accessed only when a user is logged in using the `canActivate` property in the router definition.

[{]: <helper> (diff_step 9.10)
#### Step 9.10: Require user to access PartyDetails

##### Changed client/imports/app/app.routes.ts
```diff
@@ -1,9 +1,15 @@
 ┊ 1┊ 1┊import { Route } from '@angular/router';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊import { PartiesListComponent } from './parties/parties-list.component';
 ┊ 4┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊export const routes: Route[] = [
 ┊ 7┊ 8┊  { path: '', component: PartiesListComponent },
-┊ 8┊  ┊  { path: 'party/:partyId', component: PartyDetailsComponent }
+┊  ┊ 9┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] }
 ┊ 9┊10┊];
+┊  ┊11┊
+┊  ┊12┊export const ROUTES_PROVIDERS = [{
+┊  ┊13┊  provide: 'canActivateForLoggedIn',
+┊  ┊14┊  useValue: () => !! Meteor.userId()
+┊  ┊15┊}];
```
[}]: #

We created a new provider called `canActivateForLoggedIn` that contains a boolean value with login state.

As you can see we specified only the name of that provider inside `canActivate` property.

It's worth mentioning that guards can receive more than one provider.

Now, we only need to declare this provider in our NgModule:

[{]: <helper> (diff_step 9.11)
#### Step 9.11: Add ROUTES_PROVIDERS

##### Changed client/imports/app/app.module.ts
```diff
@@ -5,7 +5,7 @@
 ┊ 5┊ 5┊import { AccountsModule } from 'angular2-meteor-accounts-ui';
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import { AppComponent } from './app.component';
-┊ 8┊  ┊import { routes } from './app.routes';
+┊  ┊ 8┊import { routes, ROUTES_PROVIDERS } from './app.routes';
 ┊ 9┊ 9┊import { PARTIES_DECLARATIONS } from './parties';
 ┊10┊10┊
 ┊11┊11┊@NgModule({
```
```diff
@@ -20,6 +20,9 @@
 ┊20┊20┊    AppComponent,
 ┊21┊21┊    ...PARTIES_DECLARATIONS
 ┊22┊22┊  ],
+┊  ┊23┊  providers: [
+┊  ┊24┊    ...ROUTES_PROVIDERS
+┊  ┊25┊  ],
 ┊23┊26┊  bootstrap: [
 ┊24┊27┊    AppComponent
 ┊25┊28┊  ]
```
[}]: #

# InjectUser

If you place `@InjectUser` above the `PartiesFormComponent` it will inject a new user property:

__`client/imports/parties/parties-form.component.ts`__:

    import { InjectUser } from 'angular2-meteor-accounts-ui';

    import template from './parties-form.component.html';

    @Component({
      selector: 'parties-form',
      template,
    })
    @InjectUser('user')
    export class PartiesFormComponent {
      user: Meteor.User;

      constructor() {
        console.log(this.user);
      }
    }

Call `this.user` and you will see that it returns the same object as `Meteor.user()`.
The new property is reactive and can be used in any template, for example:

__`client/imports/parties/parties-form.component.html`__:

    <div *ngIf="!user">Please, log in to change party</div>
    <form ...>
      ...
    </form>

As you can see, we've added a label "Please, login to change party" that is
conditioned to be shown if `user` is not defined with help of an `ngIf` attribute, and
will be hidden otherwise.

# Routing Permissions

Let's imagine now that we allow to see and change party details only for logged-in users.
An ideal way to implement this would be to restrict redirecting to the party details page when
someone clicks on a party link. In this case, we don't need to check access manually in the party details component itself because the route request is denied early on.

This can be easily done again with help of `CanActivate` property. You can do this with the PartyDetailsComponent, just like we did previous steps earlier with the PartiesFormComponent.

Now log out and try to click on any party link. See, links don't work!

But what about more sophisticated access? Say, let's prevent access into the PartyDetails view for those
who don't own that particular party.

It could be done inside of a component using `canActivate` method.

Let's add a `canActivate` method and `CanActivate` interface, where we get the current route's `partyId` parameter
and check if the corresponding party's owner is the same as the currently logged-in user.

  __`client/imports/parties/party-details.component.ts`__:
    import { CanActivate } from '@angular/router';
    import template from './party-details.component.html';

    @Component({
      selector: 'party-details',
      template
    })
    export class PartyDetails implements CanActivate {
      ...

      canActivate() {
        const party = Parties.findOne(this.partyId);
        return (party && party.owner == Meteor.userId());
      }
    }

Now log in, then add a new party, log out and click on the party link.
Nothing happens meaning that access is restricted to party owners.

Please note it is possible for someone with malicious intent to override your routing restrictions on the client.
You should never restrict access to sensitive data, sensitive areas, using the client router only.

This is the reason we also made restrictions on the server using the allow/deny functionality, so even if someone gets in they cannot make updates.
While this prevents writes from happening from unintended sources, reads can still be an issue.
The next step will take care of privacy, not showing users parties they are not allowed to see.

# Summary

Amazing, only a few lines of code and we have a much more secure application!

We've added two powerful features to our app:

- the "accounts-ui" package that comes with features like user login, logout, registration
  and complete UI supporting them;
- restricted access to the party details page, with access available for logged-in users only.
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step8.md) | [Next Step >](step10.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #