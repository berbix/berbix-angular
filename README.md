# Berbix Angular SDK

This Berbix Angular library provides simple interfaces to interact with the Berbix Verify flow.

## Installation

    npm install berbix-angular

## Usage

### Basic usage

Add the BerbixComponent to your module declarations. For example, a new project generated
with `ng new` might include the following.

```js
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BerbixComponent } from "berbix-angular";

@NgModule({
  declarations: [AppComponent, BerbixComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Now you can use the `lib-berbix` component in your templates.

```
<lib-berbix
  clientToken="your_client_token"
  (flowDisplayed)="display()"
  (flowCompleted)="complete($event)"
></lib-berbix>
```

### Full list of props

```js
// Required
@Input() clientToken: string;

// Event emitters
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
