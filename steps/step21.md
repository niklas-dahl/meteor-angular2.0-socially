[__prod__]: #
[{]: <region> (header)

[}]: #
[{]: <region> (body)
# Handling Files with CollectionFS

In this step we are going to add the ability to upload images into our app, and also sorting and naming them.

Angular-Meteor can use Meteor [UploadFS](https://github.com/jalik/jalik-ufs) which is a suite of Meteor packages that together provide a complete file management solution including uploading, downloading, storage, synchronization, manipulation, and copying.

It supports several storage adapters for saving files to the local filesystem, GridFS and additional storage adapters can be created.

The process is very similar for handling any other MongoDB Collection!

So let's add image upload to our app!


We will start by adding UploadFS to our project, by running the following command:

    $ meteor add jalik:ufs

Now, we will decide the storage adapter we want to use.
In this example, we will use the GridFS as storage adapters, so we will add the adapter by running this command:

    $ meteor add jalik:ufs-gridfs

Note: you can find more information about Stores and Storage Adapters on the [UploadFS](https://github.com/jalik/jalik-ufs)'s GitHub repository.

So now we have the UploadFS support and the storage adapter installed - we still need to create a UploadFS object to handle our files.
Note that you will need to define the collection as shared resource because you will need to use the collection in both client and server side.

### Creating the Mongo Collection and UploadFS Store

Let's start by creating `both/collections/images.collection.ts` file, and define a Mongo Collection object called "Images". Since we want to be able to make thumbnails we have to create another Collection called "Thumbs".

Also we will use the stadard Mongo Collection API that allows us to defined auth-rules.

[{]: <helper> (diff_step 21.2)
#### Step 21.29: Basic styles

##### Added client/imports/app/parties/parties-upload.component.scss
```diff
@@ -0,0 +1,16 @@
+┊  ┊ 1┊.file-uploading {
+┊  ┊ 2┊  opacity: 0.3;
+┊  ┊ 3┊}
+┊  ┊ 4┊
+┊  ┊ 5┊.file-is-over {
+┊  ┊ 6┊  opacity: 0.7;
+┊  ┊ 7┊}
+┊  ┊ 8┊
+┊  ┊ 9┊[filedrop] {
+┊  ┊10┊  width: 100%;
+┊  ┊11┊  height: 100px;
+┊  ┊12┊  line-height: 100px;
+┊  ┊13┊  text-align: center;
+┊  ┊14┊  background-color: #f1f1f1;
+┊  ┊15┊  margin: 10px 0;
+┊  ┊16┊}🚫↵
```
[}]: #

Let's now create interfaces for both collections:

[{]: <helper> (diff_step 21.3)
#### Step 21.39: Implement the pipe

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -27,6 +27,7 @@
 ┊27┊27┊          <div *ngFor="let party of parties | async">
 ┊28┊28┊            <md-card>
 ┊29┊29┊              <md-card-content>
+┊  ┊30┊                <img *ngIf="party.images" class="party-main-image" [src]="party | displayMainImage">
 ┊30┊31┊                <h2 class="md-title ma-name">
 ┊31┊32┊                  <a [routerLink]="['/party', party._id]">{{party.name}}</a>
 ┊32┊33┊                </h2>
```
[}]: #

[{]: <helper> (diff_step 21.4)
#### Step 21.42: Reset files on ngSubmit

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊<form [formGroup]="addForm" (ngSubmit)="addParty()">
+┊ ┊1┊<form [formGroup]="addForm" (ngSubmit)="addParty(); upload.reset()">
 ┊2┊2┊  <fieldset class="form-group">
 ┊3┊3┊    <md-input formControlName="name" placeholder="Party name"></md-input>
 ┊4┊4┊    <md-input formControlName="description" placeholder="Description"></md-input>
```
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊      <md-checkbox formControlName="public">Public</md-checkbox>
 ┊ 9┊ 9┊    </div>
 ┊10┊10┊
-┊11┊  ┊    <parties-upload (onFile)="onImage($event)"></parties-upload>
+┊  ┊11┊    <parties-upload #upload (onFile)="onImage($event)"></parties-upload>
 ┊12┊12┊
 ┊13┊13┊    <button md-raised-button type="submit">Add</button>
 ┊14┊14┊  </fieldset>
```
[}]: #

And use them on Images and Thumbs collections:

[{]: <helper> (diff_step 21.5)
#### Step 21.5: Add interfaces to Mongo Collections

##### Changed both/collections/images.collection.ts
```diff
@@ -1,8 +1,9 @@
 ┊1┊1┊import { MongoObservable } from 'meteor-rxjs';
 ┊2┊2┊import { Meteor } from 'meteor/meteor';
+┊ ┊3┊import {Thumb, Image} from "../models/image.model";
 ┊3┊4┊
-┊4┊ ┊export const Images = new MongoObservable.Collection('images');
-┊5┊ ┊export const Thumbs = new MongoObservable.Collection('thumbs');
+┊ ┊5┊export const Images = new MongoObservable.Collection<Image>('images');
+┊ ┊6┊export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');
 ┊6┊7┊
 ┊7┊8┊function loggedIn(userId) {
 ┊8┊9┊  return !!userId;
```
[}]: #

We have to create Stores for Images and Thumbs.

[{]: <helper> (diff_step 21.6)
#### Step 21.6: Create stores for Images and Thumbs

##### Changed both/collections/images.collection.ts
```diff
@@ -1,10 +1,27 @@
 ┊ 1┊ 1┊import { MongoObservable } from 'meteor-rxjs';
 ┊ 2┊ 2┊import { Meteor } from 'meteor/meteor';
 ┊ 3┊ 3┊import {Thumb, Image} from "../models/image.model";
+┊  ┊ 4┊import { UploadFS } from 'meteor/jalik:ufs';
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊export const Images = new MongoObservable.Collection<Image>('images');
 ┊ 6┊ 7┊export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');
 ┊ 7┊ 8┊
+┊  ┊ 9┊export const ThumbsStore = new UploadFS.store.GridFS({
+┊  ┊10┊  collection: Thumbs.collection,
+┊  ┊11┊  name: 'thumbs'
+┊  ┊12┊});
+┊  ┊13┊
+┊  ┊14┊export const ImagesStore = new UploadFS.store.GridFS({
+┊  ┊15┊  collection: Images.collection,
+┊  ┊16┊  name: 'images',
+┊  ┊17┊  filter: new UploadFS.Filter({
+┊  ┊18┊    contentTypes: ['image/*']
+┊  ┊19┊  }),
+┊  ┊20┊  copyTo: [
+┊  ┊21┊    ThumbsStore
+┊  ┊22┊  ]
+┊  ┊23┊});
+┊  ┊24┊
 ┊ 8┊25┊function loggedIn(userId) {
 ┊ 9┊26┊  return !!userId;
 ┊10┊27┊}
```
[}]: #

Let's explain a bit what happened.

* We assigned Stores to their Collections, which is required.
* We defined names of these Stores.
* We added filter to ImagesStore so it can receive only images.
* Every file will be copied to ThumbsStore.

There is a reason why we called one of the Collections the `Thumbs`!

Since we transfer every uploaded file to ThumbsStore, we can now easily add file manipulations.

Let's resize every file to 32x32:

[{]: <helper> (diff_step 21.7)
#### Step 21.7: Resize images

##### Changed both/collections/images.collection.ts
```diff
@@ -8,7 +8,19 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊export const ThumbsStore = new UploadFS.store.GridFS({
 ┊10┊10┊  collection: Thumbs.collection,
-┊11┊  ┊  name: 'thumbs'
+┊  ┊11┊  name: 'thumbs',
+┊  ┊12┊  transformWrite(from, to, fileId, file) {
+┊  ┊13┊    // Resize to 32x32
+┊  ┊14┊    const gm = require('gm');
+┊  ┊15┊
+┊  ┊16┊    gm(from, file.name)
+┊  ┊17┊      .resize(32, 32)
+┊  ┊18┊      .gravity('Center')
+┊  ┊19┊      .extent(32, 32)
+┊  ┊20┊      .quality(75)
+┊  ┊21┊      .stream()
+┊  ┊22┊      .pipe(to);
+┊  ┊23┊  }
 ┊12┊24┊});
 ┊13┊25┊
 ┊14┊26┊export const ImagesStore = new UploadFS.store.GridFS({
```
[}]: #

We used [`gm`](https://github.com/aheckmann/gm) module, let's install it:

    $ meteor npm install gm --save

> Note: To use this module, you need download and install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/). In Mac OS X, you can use [Homebrew](http://brew.sh/) and do: `brew install graphicsmagick` or `brew install imagemagick`.


### Image upload

Note that for file upload you can use basic HTML `<input type="file">` or any other package - you only need the HTML5 File object to be provided.

For our application, we would like to add ability to drag-and-drop images, so we use Angular2 directive that handles file upload and gives us more abilities such as drag & drop, on the client side. In this example, We used [`angular2-file-drop`](https://github.com/jellyjs/angular2-file-drop), which is still in develop. In order to do this, let's add the package to our project:

    $ meteor npm install angular2-file-drop --save

And let's add it's module to ours:

[{]: <helper> (diff_step 21.10)
#### Step 21.10: Include file drop module

##### Changed client/imports/app/app.module.ts
```diff
@@ -18,6 +18,7 @@
 ┊18┊18┊import { MdCheckboxModule } from "@angular2-material/checkbox";
 ┊19┊19┊import {MdListModule} from "@angular2-material/list";
 ┊20┊20┊import {AUTH_DECLARATIONS} from "./auth/index";
+┊  ┊21┊import {FileDropModule} from "angular2-file-drop";
 ┊21┊22┊
 ┊22┊23┊@NgModule({
 ┊23┊24┊  imports: [
```
```diff
@@ -36,7 +37,8 @@
 ┊36┊37┊    MdInputModule.forRoot(),
 ┊37┊38┊    MdCardModule.forRoot(),
 ┊38┊39┊    MdCheckboxModule.forRoot(),
-┊39┊  ┊    MdListModule.forRoot()
+┊  ┊40┊    MdListModule.forRoot(),
+┊  ┊41┊    FileDropModule
 ┊40┊42┊  ],
 ┊41┊43┊  declarations: [
 ┊42┊44┊    AppComponent,
```
[}]: #

Now, let's create the `PartiesUpload` component. It will be responsible for uploading photos, starting with a stub of the view:

[{]: <helper> (diff_step 21.11)
#### Step 21.11: Create a view for an upload

##### Added client/imports/app/parties/parties-upload.component.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<div layout="column">
+┊ ┊2┊  <div>
+┊ ┊3┊    <div>Drop an image to here</div>
+┊ ┊4┊  </div>
+┊ ┊5┊</div>🚫↵
```
[}]: #

And the `Component`:

[{]: <helper> (diff_step 21.12)
#### Step 21.12: Create a PartiesUpload component

##### Added client/imports/app/parties/parties-upload.component.ts
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊
+┊  ┊ 3┊import template from './parties-upload.component.html';
+┊  ┊ 4┊
+┊  ┊ 5┊@Component({
+┊  ┊ 6┊  selector: 'parties-upload',
+┊  ┊ 7┊  template
+┊  ┊ 8┊})
+┊  ┊ 9┊export class PartiesUploadComponent {
+┊  ┊10┊  constructor() {}
+┊  ┊11┊}🚫↵
```
[}]: #

And let's add it to our declarations file:

[{]: <helper> (diff_step 21.13)
#### Step 21.13: Added PartiesUpload component to the index file

##### Changed client/imports/app/parties/index.ts
```diff
@@ -1,9 +1,11 @@
 ┊ 1┊ 1┊import { PartiesFormComponent } from './parties-form.component';
 ┊ 2┊ 2┊import { PartiesListComponent } from './parties-list.component';
 ┊ 3┊ 3┊import { PartyDetailsComponent } from './party-details.component';
+┊  ┊ 4┊import {PartiesUploadComponent} from "./parties-upload.component";
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊export const PARTIES_DECLARATIONS = [
 ┊ 6┊ 7┊  PartiesFormComponent,
 ┊ 7┊ 8┊  PartiesListComponent,
-┊ 8┊  ┊  PartyDetailsComponent
+┊  ┊ 9┊  PartyDetailsComponent,
+┊  ┊10┊  PartiesUploadComponent
 ┊ 9┊11┊];
```
[}]: #

We want to use it in `PartiesForm`:

[{]: <helper> (diff_step 21.14)
#### Step 21.14: Use PartiesUploadComponent inside the form

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -8,6 +8,8 @@
 ┊ 8┊ 8┊      <md-checkbox formControlName="public">Public</md-checkbox>
 ┊ 9┊ 9┊    </div>
 ┊10┊10┊
+┊  ┊11┊    <parties-upload></parties-upload>
+┊  ┊12┊
 ┊11┊13┊    <button md-raised-button type="submit">Add</button>
 ┊12┊14┊  </fieldset>
 ┊13┊15┊</form>🚫↵
```
[}]: #

Now, let's implement `fileDrop` directive:

[{]: <helper> (diff_step 21.15)
#### Step 21.15: Add bindings to FileDrop

##### Changed client/imports/app/parties/parties-upload.component.html
```diff
@@ -1,5 +1,8 @@
 ┊1┊1┊<div layout="column">
-┊2┊ ┊  <div>
+┊ ┊2┊  <div fileDrop
+┊ ┊3┊       [ngClass]="{'file-is-over': fileIsOver}"
+┊ ┊4┊       (fileOver)="fileOver($event)"
+┊ ┊5┊       (onFileDrop)="onFileDrop($event)">
 ┊3┊6┊    <div>Drop an image to here</div>
 ┊4┊7┊  </div>
 ┊5┊8┊</div>🚫↵
```
[}]: #

As you can see we used `fileOver` event. It tells the component if file is over the drop zone.

We can now handle it inside the component:

[{]: <helper> (diff_step 21.16)
#### Step 21.16: Handle fileIsOver

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -7,5 +7,11 @@
 ┊ 7┊ 7┊  template
 ┊ 8┊ 8┊})
 ┊ 9┊ 9┊export class PartiesUploadComponent {
+┊  ┊10┊  fileIsOver: boolean = false;
+┊  ┊11┊
 ┊10┊12┊  constructor() {}
+┊  ┊13┊
+┊  ┊14┊  fileOver(fileIsOver: boolean): void {
+┊  ┊15┊    this.fileIsOver = fileIsOver;
+┊  ┊16┊  }
 ┊11┊17┊}🚫↵
```
[}]: #

Second thing is to handle `onFileDrop` event:

[{]: <helper> (diff_step 21.17)
#### Step 21.17: Implement onFileDrop method

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -14,4 +14,8 @@
 ┊14┊14┊  fileOver(fileIsOver: boolean): void {
 ┊15┊15┊    this.fileIsOver = fileIsOver;
 ┊16┊16┊  }
+┊  ┊17┊
+┊  ┊18┊  onFileDrop(file: File): void {
+┊  ┊19┊    console.log('Got file');
+┊  ┊20┊  }
 ┊17┊21┊}🚫↵
```
[}]: #

Now our component is able to catch any dropped file, so let's create a function to upload that file into server.

[{]: <helper> (diff_step 21.18)
#### Step 21.18: Implement the upload method

##### Added both/methods/images.methods.ts
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊import { UploadFS } from 'meteor/jalik:ufs';
+┊  ┊ 2┊import { ImagesStore } from '../collections/images.collection';
+┊  ┊ 3┊
+┊  ┊ 4┊export function upload(data: File): Promise<any> {
+┊  ┊ 5┊  return new Promise((resolve, reject) => {
+┊  ┊ 6┊    // pick from an object only: name, type and size
+┊  ┊ 7┊    const file = {
+┊  ┊ 8┊      name: data.name,
+┊  ┊ 9┊      type: data.type,
+┊  ┊10┊      size: data.size,
+┊  ┊11┊    };
+┊  ┊12┊
+┊  ┊13┊    const upload = new UploadFS.Uploader({
+┊  ┊14┊      data,
+┊  ┊15┊      file,
+┊  ┊16┊      store: ImagesStore,
+┊  ┊17┊      onError: reject,
+┊  ┊18┊      onComplete: resolve
+┊  ┊19┊    });
+┊  ┊20┊
+┊  ┊21┊    upload.start();
+┊  ┊22┊  });
+┊  ┊23┊}🚫↵
```
[}]: #

Quick explanation. We need to know the name, the type and also the size of file we want to upload. We can get it from `data` object.

Now we can move on to use that function in `PartiesUpload` component:

[{]: <helper> (diff_step 21.19)
#### Step 21.19: Use the upload function

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -2,12 +2,15 @@
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
+┊  ┊ 5┊import { upload } from '../../../../both/methods/images.methods';
+┊  ┊ 6┊
 ┊ 5┊ 7┊@Component({
 ┊ 6┊ 8┊  selector: 'parties-upload',
 ┊ 7┊ 9┊  template
 ┊ 8┊10┊})
 ┊ 9┊11┊export class PartiesUploadComponent {
 ┊10┊12┊  fileIsOver: boolean = false;
+┊  ┊13┊  uploading: boolean = false;
 ┊11┊14┊
 ┊12┊15┊  constructor() {}
 ┊13┊16┊
```
```diff
@@ -16,6 +19,15 @@
 ┊16┊19┊  }
 ┊17┊20┊
 ┊18┊21┊  onFileDrop(file: File): void {
-┊19┊  ┊    console.log('Got file');
+┊  ┊22┊    this.uploading = true;
+┊  ┊23┊
+┊  ┊24┊    upload(file)
+┊  ┊25┊      .then(() => {
+┊  ┊26┊        this.uploading = false;
+┊  ┊27┊      })
+┊  ┊28┊      .catch((error) => {
+┊  ┊29┊        this.uploading = false;
+┊  ┊30┊        console.log(`Something went wrong!`, error);
+┊  ┊31┊      });
 ┊20┊32┊  }
 ┊21┊33┊}🚫↵
```
[}]: #

Now let's take a little break and solve those annoying missing modules errors. Since the uploading packages we used in the `upload` method are package that comes from Meteor Atmosphere and they not provide Typings (`.d.ts` files), we need to create one for them.

Let's add it:

[{]: <helper> (diff_step 21.20)
#### Step 21.20: Declare meteor/jalik:ufs module

##### Added typings/jalik-ufs.d.ts
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊declare module "meteor/jalik:ufs" {
+┊  ┊ 2┊  interface Uploader {
+┊  ┊ 3┊    start: () => void;
+┊  ┊ 4┊  }
+┊  ┊ 5┊
+┊  ┊ 6┊  interface UploadFS {
+┊  ┊ 7┊    Uploader: (options: any) => Uploader;
+┊  ┊ 8┊  }
+┊  ┊ 9┊
+┊  ┊10┊  export var UploadFS;
+┊  ┊11┊}🚫↵
```
[}]: #

And you might see more errors because we used NodeJS API and we need to install it's `.d.ts` as well - this can be downloaded using `typings`:

    $ typings install env~node --save --global

Let's also add the `file-uploading` css class:

[{]: <helper> (diff_step 21.22)
#### Step 21.22: Implement classes

##### Changed client/imports/app/parties/parties-upload.component.html
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊<div layout="column">
 ┊2┊2┊  <div fileDrop
-┊3┊ ┊       [ngClass]="{'file-is-over': fileIsOver}"
+┊ ┊3┊       [ngClass]="{'file-is-over': fileIsOver, 'file-uploading': uploading}"
 ┊4┊4┊       (fileOver)="fileOver($event)"
 ┊5┊5┊       (onFileDrop)="onFileDrop($event)">
 ┊6┊6┊    <div>Drop an image to here</div>
```
[}]: #

### Display Uploaded Images

Let's create a simple gallery to list the images in the new party form.

First thing to do is to create a Publication for thumbnails:

[{]: <helper> (diff_step 21.23)
#### Step 21.23: Implement publications of Images and Thumbs

##### Added server/imports/publications/images.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Thumbs, Images } from '../../../both/collections/images.collection';
+┊  ┊ 3┊
+┊  ┊ 4┊Meteor.publish('thumbs', function(ids: string[]) {
+┊  ┊ 5┊  return Thumbs.collection.find({
+┊  ┊ 6┊    originalStore: 'images',
+┊  ┊ 7┊    originalId: {
+┊  ┊ 8┊      $in: ids
+┊  ┊ 9┊    }
+┊  ┊10┊  });
+┊  ┊11┊});
+┊  ┊12┊
+┊  ┊13┊Meteor.publish('images', function() {
+┊  ┊14┊  return Images.collection.find({});
+┊  ┊15┊});🚫↵
```
[}]: #

As you can see we also created a Publication for images. We will use it later.

We still need to add it on the server-side:

[{]: <helper> (diff_step 21.24)
#### Step 21.24: Import those publications in the server entry point

##### Changed server/main.ts
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊import './imports/publications/parties';
 ┊ 6┊ 6┊import './imports/publications/users';
 ┊ 7┊ 7┊import '../both/methods/parties.methods';
+┊  ┊ 8┊import './imports/publications/images';
 ┊ 8┊ 9┊
 ┊ 9┊10┊Meteor.startup(() => {
 ┊10┊11┊  loadParties();
```
[}]: #

Now let's take care of UI. This will need to be reactive, so we will use again the `MeteorObservable` wrapper and RxJS.

Let's create a `Subject` that will be in charge of notification regarding files actions:

[{]: <helper> (diff_step 21.25)
#### Step 21.25: Use RxJS to keep track of files

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -1,9 +1,11 @@
-┊ 1┊  ┊import { Component } from '@angular/core';
+┊  ┊ 1┊import {Component} from '@angular/core';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { upload } from '../../../../both/methods/images.methods';
 ┊ 6┊ 6┊
+┊  ┊ 7┊import {Subject, Subscription} from "rxjs";
+┊  ┊ 8┊
 ┊ 7┊ 9┊@Component({
 ┊ 8┊10┊  selector: 'parties-upload',
 ┊ 9┊11┊  template
```
```diff
@@ -11,6 +13,7 @@
 ┊11┊13┊export class PartiesUploadComponent {
 ┊12┊14┊  fileIsOver: boolean = false;
 ┊13┊15┊  uploading: boolean = false;
+┊  ┊16┊  files: Subject<string[]> = new Subject<string[]>();
 ┊14┊17┊
 ┊15┊18┊  constructor() {}
```
[}]: #

Let's now subscribe to `thumbs` publication with an array of those ids we created in the previous step:

[{]: <helper> (diff_step 21.26)
#### Step 21.26: Subscribe to the thumbs publication

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -1,22 +1,36 @@
-┊ 1┊  ┊import {Component} from '@angular/core';
+┊  ┊ 1┊import {Component, OnInit} from '@angular/core';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { upload } from '../../../../both/methods/images.methods';
-┊ 6┊  ┊
 ┊ 7┊ 6┊import {Subject, Subscription} from "rxjs";
+┊  ┊ 7┊import {MeteorObservable} from "meteor-rxjs";
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊@Component({
 ┊10┊10┊  selector: 'parties-upload',
 ┊11┊11┊  template
 ┊12┊12┊})
-┊13┊  ┊export class PartiesUploadComponent {
+┊  ┊13┊export class PartiesUploadComponent implements OnInit {
 ┊14┊14┊  fileIsOver: boolean = false;
 ┊15┊15┊  uploading: boolean = false;
 ┊16┊16┊  files: Subject<string[]> = new Subject<string[]>();
+┊  ┊17┊  thumbsSubscription: Subscription;
 ┊17┊18┊
 ┊18┊19┊  constructor() {}
 ┊19┊20┊
+┊  ┊21┊  ngOnInit() {
+┊  ┊22┊    this.files.subscribe((filesArray) => {
+┊  ┊23┊      MeteorObservable.autorun().subscribe(() => {
+┊  ┊24┊        if (this.thumbsSubscription) {
+┊  ┊25┊          this.thumbsSubscription.unsubscribe();
+┊  ┊26┊          this.thumbsSubscription = undefined;
+┊  ┊27┊        }
+┊  ┊28┊
+┊  ┊29┊        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe();
+┊  ┊30┊      });
+┊  ┊31┊    });
+┊  ┊32┊  }
+┊  ┊33┊
 ┊20┊34┊  fileOver(fileIsOver: boolean): void {
 ┊21┊35┊    this.fileIsOver = fileIsOver;
 ┊22┊36┊  }
```
[}]: #

Now we can look for thumbnails that come from `ImagesStore`:

[{]: <helper> (diff_step 21.27)
#### Step 21.27: Look for the thumbnails

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -3,8 +3,10 @@
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { upload } from '../../../../both/methods/images.methods';
-┊ 6┊  ┊import {Subject, Subscription} from "rxjs";
+┊  ┊ 6┊import {Subject, Subscription, Observable} from "rxjs";
 ┊ 7┊ 7┊import {MeteorObservable} from "meteor-rxjs";
+┊  ┊ 8┊import {Thumb} from "../../../../both/models/image.model";
+┊  ┊ 9┊import {Thumbs} from "../../../../both/collections/images.collection";
 ┊ 8┊10┊
 ┊ 9┊11┊@Component({
 ┊10┊12┊  selector: 'parties-upload',
```
```diff
@@ -15,6 +17,7 @@
 ┊15┊17┊  uploading: boolean = false;
 ┊16┊18┊  files: Subject<string[]> = new Subject<string[]>();
 ┊17┊19┊  thumbsSubscription: Subscription;
+┊  ┊20┊  thumbs: Observable<Thumb[]>;
 ┊18┊21┊
 ┊19┊22┊  constructor() {}
 ┊20┊23┊
```
```diff
@@ -26,7 +29,14 @@
 ┊26┊29┊          this.thumbsSubscription = undefined;
 ┊27┊30┊        }
 ┊28┊31┊
-┊29┊  ┊        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe();
+┊  ┊32┊        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe(() => {
+┊  ┊33┊          this.thumbs = Thumbs.find({
+┊  ┊34┊            originalStore: 'images',
+┊  ┊35┊            originalId: {
+┊  ┊36┊              $in: filesArray
+┊  ┊37┊            }
+┊  ┊38┊          }).zone();
+┊  ┊39┊        });
 ┊30┊40┊      });
 ┊31┊41┊    });
 ┊32┊42┊  }
```
[}]: #

We still don't see any thumbnails, so let's add a view for the thumbs:

[{]: <helper> (diff_step 21.28)
#### Step 21.28: Implement the thumbnails in the view

##### Changed client/imports/app/parties/parties-upload.component.html
```diff
@@ -5,4 +5,10 @@
 ┊ 5┊ 5┊       (onFileDrop)="onFileDrop($event)">
 ┊ 6┊ 6┊    <div>Drop an image to here</div>
 ┊ 7┊ 7┊  </div>
+┊  ┊ 8┊
+┊  ┊ 9┊  <div layout="row" *ngIf="thumbs">
+┊  ┊10┊    <div *ngFor="let thumb of thumbs | async">
+┊  ┊11┊      <img [src]="thumb.url"/>
+┊  ┊12┊    </div>
+┊  ┊13┊  </div>
 ┊ 8┊14┊</div>🚫↵
```
[}]: #

Since we are working on a view right now, let's add some style.

We need to create `parties-upload.component.scss` file:

[{]: <helper> (diff_step 21.29)
#### Step 21.29: Basic styles

##### Added client/imports/app/parties/parties-upload.component.scss
```diff
@@ -0,0 +1,16 @@
+┊  ┊ 1┊.file-uploading {
+┊  ┊ 2┊  opacity: 0.3;
+┊  ┊ 3┊}
+┊  ┊ 4┊
+┊  ┊ 5┊.file-is-over {
+┊  ┊ 6┊  opacity: 0.7;
+┊  ┊ 7┊}
+┊  ┊ 8┊
+┊  ┊ 9┊[filedrop] {
+┊  ┊10┊  width: 100%;
+┊  ┊11┊  height: 100px;
+┊  ┊12┊  line-height: 100px;
+┊  ┊13┊  text-align: center;
+┊  ┊14┊  background-color: #f1f1f1;
+┊  ┊15┊  margin: 10px 0;
+┊  ┊16┊}🚫↵
```
[}]: #

and to import that file in `client/main.scss`:

[{]: <helper> (diff_step 21.30)
#### Step 21.30: Import styles inside main.scss

##### Changed client/main.scss
```diff
@@ -44,4 +44,5 @@
 ┊44┊44┊}
 ┊45┊45┊
 ┊46┊46┊@import "./imports/app/parties/parties-list.component";
-┊47┊  ┊@import "./imports/app/parties/party-details.component";🚫↵
+┊  ┊47┊@import "./imports/app/parties/party-details.component";
+┊  ┊48┊@import "./imports/app/parties/parties-upload.component";🚫↵
```
[}]: #

Great! We can move on to the next step. Let's do something with the result of the `upload` function.

We will create the `addFile` method that updates the `files` property, and we will add the actual array the in charge of the notifications in `files` (which is a `Subject` and only in charge of the notifications, not the actual data):

[{]: <helper> (diff_step 21.31)
#### Step 21.31: Handle file upload

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -15,6 +15,7 @@
 ┊15┊15┊export class PartiesUploadComponent implements OnInit {
 ┊16┊16┊  fileIsOver: boolean = false;
 ┊17┊17┊  uploading: boolean = false;
+┊  ┊18┊  filesArray: string[] = [];
 ┊18┊19┊  files: Subject<string[]> = new Subject<string[]>();
 ┊19┊20┊  thumbsSubscription: Subscription;
 ┊20┊21┊  thumbs: Observable<Thumb[]>;
```
```diff
@@ -49,12 +50,18 @@
 ┊49┊50┊    this.uploading = true;
 ┊50┊51┊
 ┊51┊52┊    upload(file)
-┊52┊  ┊      .then(() => {
+┊  ┊53┊      .then((result) => {
 ┊53┊54┊        this.uploading = false;
+┊  ┊55┊        this.addFile(result);
 ┊54┊56┊      })
 ┊55┊57┊      .catch((error) => {
 ┊56┊58┊        this.uploading = false;
 ┊57┊59┊        console.log(`Something went wrong!`, error);
 ┊58┊60┊      });
 ┊59┊61┊  }
+┊  ┊62┊
+┊  ┊63┊  addFile(file) {
+┊  ┊64┊    this.filesArray.push(file._id);
+┊  ┊65┊    this.files.next(this.filesArray);
+┊  ┊66┊  }
 ┊60┊67┊}🚫↵
```
[}]: #

We want a communication between PartiesUpload and PartiesForm. Let's use `Output` decorator and the `EventEmitter` to notify PartiesForm component about every new file.

[{]: <helper> (diff_step 21.32)
#### Step 21.32: Emit event with the new file

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import {Component, OnInit} from '@angular/core';
+┊ ┊1┊import {Component, OnInit, EventEmitter, Output} from '@angular/core';
 ┊2┊2┊
 ┊3┊3┊import template from './parties-upload.component.html';
 ┊4┊4┊
```
```diff
@@ -19,6 +19,7 @@
 ┊19┊19┊  files: Subject<string[]> = new Subject<string[]>();
 ┊20┊20┊  thumbsSubscription: Subscription;
 ┊21┊21┊  thumbs: Observable<Thumb[]>;
+┊  ┊22┊  @Output() onFile: EventEmitter<string> = new EventEmitter<string>();
 ┊22┊23┊
 ┊23┊24┊  constructor() {}
 ┊24┊25┊
```
```diff
@@ -63,5 +64,6 @@
 ┊63┊64┊  addFile(file) {
 ┊64┊65┊    this.filesArray.push(file._id);
 ┊65┊66┊    this.files.next(this.filesArray);
+┊  ┊67┊    this.onFile.emit(file._id);
 ┊66┊68┊  }
 ┊67┊69┊}🚫↵
```
[}]: #

On the receiving side of this connection we have the PartiesForm component.

Create a method that handles an event with the new file and put images inside the FormBuilder.

[{]: <helper> (diff_step 21.33)
#### Step 21.33: Add images to the PartiesForm component

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -12,6 +12,7 @@
 ┊12┊12┊})
 ┊13┊13┊export class PartiesFormComponent implements OnInit {
 ┊14┊14┊  addForm: FormGroup;
+┊  ┊15┊  images: string[] = [];
 ┊15┊16┊
 ┊16┊17┊  constructor(
 ┊17┊18┊    private formBuilder: FormBuilder
```
```diff
@@ -39,6 +40,7 @@
 ┊39┊40┊        location: {
 ┊40┊41┊          name: this.addForm.value.location
 ┊41┊42┊        },
+┊  ┊43┊        images: this.images,
 ┊42┊44┊        public: this.addForm.value.public,
 ┊43┊45┊        owner: Meteor.userId()
 ┊44┊46┊      });
```
```diff
@@ -46,4 +48,8 @@
 ┊46┊48┊      this.addForm.reset();
 ┊47┊49┊    }
 ┊48┊50┊  }
+┊  ┊51┊
+┊  ┊52┊  onImage(imageId: string) {
+┊  ┊53┊    this.images.push(imageId);
+┊  ┊54┊  }
 ┊49┊55┊}
```
[}]: #

To keep Party interface up to date, we need to add `images` to it:

[{]: <helper> (diff_step 21.34)
#### Step 21.34: Add images property to the Party interface

##### Changed both/models/party.model.ts
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊  public: boolean;
 ┊ 9┊ 9┊  invited?: string[];
 ┊10┊10┊  rsvps?: RSVP[];
+┊  ┊11┊  images?: string[];
 ┊11┊12┊}
 ┊12┊13┊
 ┊13┊14┊interface RSVP {
```
[}]: #

The last step will be to create an event binding for `onFile`.

[{]: <helper> (diff_step 21.35)
#### Step 21.35: Bind the onFile event

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊      <md-checkbox formControlName="public">Public</md-checkbox>
 ┊ 9┊ 9┊    </div>
 ┊10┊10┊
-┊11┊  ┊    <parties-upload></parties-upload>
+┊  ┊11┊    <parties-upload (onFile)="onImage($event)"></parties-upload>
 ┊12┊12┊
 ┊13┊13┊    <button md-raised-button type="submit">Add</button>
 ┊14┊14┊  </fieldset>
```
[}]: #

### Display the main image of each party on the list

We will use Pipes to achieve this.

Let's create the `DisplayMainImagePipe` inside `client/imports/app/shared/display-main-image.pipe.ts`:

[{]: <helper> (diff_step 21.36)
#### Step 21.36: Create DisplayMainImage pipe

##### Added client/imports/app/shared/display-main-image.pipe.ts
```diff
@@ -0,0 +1,25 @@
+┊  ┊ 1┊import {Pipe, PipeTransform} from '@angular/core';
+┊  ┊ 2┊import { Images } from '../../../../both/collections/images.collection';
+┊  ┊ 3┊import { Party } from '../../../../both/models/party.model';
+┊  ┊ 4┊
+┊  ┊ 5┊@Pipe({
+┊  ┊ 6┊  name: 'displayMainImage'
+┊  ┊ 7┊})
+┊  ┊ 8┊export class DisplayMainImagePipe implements PipeTransform {
+┊  ┊ 9┊  transform(party: Party) {
+┊  ┊10┊    if (!party) {
+┊  ┊11┊      return;
+┊  ┊12┊    }
+┊  ┊13┊
+┊  ┊14┊    let imageUrl: string;
+┊  ┊15┊    let imageId: string = (party.images || [])[0];
+┊  ┊16┊
+┊  ┊17┊    const found = Images.findOne(imageId);
+┊  ┊18┊
+┊  ┊19┊    if (found) {
+┊  ┊20┊      imageUrl = found.url;
+┊  ┊21┊    }
+┊  ┊22┊
+┊  ┊23┊    return imageUrl;
+┊  ┊24┊  }
+┊  ┊25┊}🚫↵
```
[}]: #

Since we have it done, let's add it to PartiesList:

[{]: <helper> (diff_step 21.37)
#### Step 21.37: Add DisplayMainImage pipe

##### Changed client/imports/app/shared/index.ts
```diff
@@ -1,7 +1,9 @@
 ┊1┊1┊import { DisplayNamePipe } from './display-name.pipe';
 ┊2┊2┊import {RsvpPipe} from "./rsvp.pipe";
+┊ ┊3┊import {DisplayMainImagePipe} from "./display-main-image.pipe";
 ┊3┊4┊
 ┊4┊5┊export const SHARED_DECLARATIONS: any[] = [
 ┊5┊6┊  DisplayNamePipe,
-┊6┊ ┊  RsvpPipe
+┊ ┊7┊  RsvpPipe,
+┊ ┊8┊  DisplayMainImagePipe
 ┊7┊9┊];
```
[}]: #

We also need to subscribe to `images`:

[{]: <helper> (diff_step 21.38)
#### Step 21.38: Subscribe to the images publication

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -39,6 +39,7 @@
 ┊39┊39┊  autorunSub: Subscription;
 ┊40┊40┊  location: Subject<string> = new Subject<string>();
 ┊41┊41┊  user: Meteor.User;
+┊  ┊42┊  imagesSubs: Subscription;
 ┊42┊43┊
 ┊43┊44┊  constructor(
 ┊44┊45┊    private paginationService: PaginationService
```
```diff
@@ -88,6 +89,8 @@
 ┊88┊89┊      this.partiesSize = Counts.get('numberOfParties');
 ┊89┊90┊      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
 ┊90┊91┊    });
+┊  ┊92┊
+┊  ┊93┊    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
 ┊91┊94┊  }
 ┊92┊95┊
 ┊93┊96┊  removeParty(party: Party): void {
```
```diff
@@ -115,5 +118,6 @@
 ┊115┊118┊    this.partiesSub.unsubscribe();
 ┊116┊119┊    this.optionsSub.unsubscribe();
 ┊117┊120┊    this.autorunSub.unsubscribe();
+┊   ┊121┊    this.imagesSubs.unsubscribe();
 ┊118┊122┊  }
 ┊119┊123┊}
```
[}]: #

We can now just implement it:

[{]: <helper> (diff_step 21.39)
#### Step 21.39: Implement the pipe

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -27,6 +27,7 @@
 ┊27┊27┊          <div *ngFor="let party of parties | async">
 ┊28┊28┊            <md-card>
 ┊29┊29┊              <md-card-content>
+┊  ┊30┊                <img *ngIf="party.images" class="party-main-image" [src]="party | displayMainImage">
 ┊30┊31┊                <h2 class="md-title ma-name">
 ┊31┊32┊                  <a [routerLink]="['/party', party._id]">{{party.name}}</a>
 ┊32┊33┊                </h2>
```
[}]: #

Add some css rules to keep the control of images:

[{]: <helper> (diff_step 21.40)
#### Step 21.40: Add some styles

##### Changed client/imports/app/parties/parties-list.component.scss
```diff
@@ -58,4 +58,9 @@
 ┊58┊58┊
 ┊59┊59┊.search-form {
 ┊60┊60┊  margin-bottom: 1em;
+┊  ┊61┊}
+┊  ┊62┊
+┊  ┊63┊img.party-main-image {
+┊  ┊64┊  max-width: 100%;
+┊  ┊65┊  max-height: 100%;
 ┊61┊66┊}🚫↵
```
[}]: #

We still need to add the reset functionality to the component, since we want to manage what happens after images were added:

[{]: <helper> (diff_step 21.41)
#### Step 21.41: Add the reset method to PartiesUpload component

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -66,4 +66,9 @@
 ┊66┊66┊    this.files.next(this.filesArray);
 ┊67┊67┊    this.onFile.emit(file._id);
 ┊68┊68┊  }
+┊  ┊69┊
+┊  ┊70┊  reset() {
+┊  ┊71┊    this.filesArray = [];
+┊  ┊72┊    this.files.next(this.filesArray);
+┊  ┊73┊  }
 ┊69┊74┊}🚫↵
```
[}]: #

By using `#upload` we get access to the PartiesUpload component's API. We can now use the `reset()`` method:

[{]: <helper> (diff_step 21.42)
#### Step 21.42: Reset files on ngSubmit

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊<form [formGroup]="addForm" (ngSubmit)="addParty()">
+┊ ┊1┊<form [formGroup]="addForm" (ngSubmit)="addParty(); upload.reset()">
 ┊2┊2┊  <fieldset class="form-group">
 ┊3┊3┊    <md-input formControlName="name" placeholder="Party name"></md-input>
 ┊4┊4┊    <md-input formControlName="description" placeholder="Description"></md-input>
```
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊      <md-checkbox formControlName="public">Public</md-checkbox>
 ┊ 9┊ 9┊    </div>
 ┊10┊10┊
-┊11┊  ┊    <parties-upload (onFile)="onImage($event)"></parties-upload>
+┊  ┊11┊    <parties-upload #upload (onFile)="onImage($event)"></parties-upload>
 ┊12┊12┊
 ┊13┊13┊    <button md-raised-button type="submit">Add</button>
 ┊14┊14┊  </fieldset>
```
[}]: #

And that's it!

### Cloud Storage

By storing files in the cloud you can reduce your costs and get a lot of other benefits.

Since this chapter is all about uploading files and UploadFS doesn't have built-in support for cloud services we should mention another library for that.

We recommend you to use [Slingshot](https://github.com/CulturalMe/meteor-slingshot/). You can install it by running:

    $ meteor add edgee:slingshot

It's very easy to use with AWS S3, Google Cloud and other cloud storage services.

From slignshot's repository:

> meteor-slingshot uploads the files directly to the cloud service from the browser without ever exposing your secret access key or any other sensitive data to the client and without requiring public write access to cloud storage to the entire public.
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step20.md) | [Next Step >](step22.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #