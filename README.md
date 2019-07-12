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
@Input() clientToken: string;

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
