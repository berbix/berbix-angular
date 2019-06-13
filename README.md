# BerbixAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



# Berbix Angular SDK

This Berbix Angular library provides simple interfaces to interact with the Berbix Verify flow.

## Installation

    npm install berbix-angular

## Usage

### Basic usage

Add the BerbixComponent to your module declarations. For example, a new project generated
with `ng new` might include the following.

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BerbixComponent } from 'berbix-angular';


@NgModule({
  declarations: [
    AppComponent,
    BerbixComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Now you can use the `lib-berbix` component in your templates.

```
<lib-berbix
  clientId="your_client_id"
  role="your_role_key"
  environment="production"
  (flowDisplayed)="display()"
  (flowCompleted)="complete($event)"
></lib-berbix>
```

### Full list of props

```js
@Input() clientId: string;
@Input() role: string;
@Input() baseUrl: string;
@Input() environment: string;
@Input() overrideUrl: string;
@Input() version = 'v0';
@Input() email: string;
@Input() phone: string;
@Input() continuation: string;

@Output() flowCompleted = new EventEmitter<FlowCompletedEvent>();
@Output() flowError = new EventEmitter<object>();
@Output() flowDisplayed = new EventEmitter<any>();
@Output() flowStateChange = new EventEmitter<object>();
```

## Publishing

    # Update the version in package.json
    ng build
    cd dist/berbix
    npm publish
