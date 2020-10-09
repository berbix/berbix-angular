import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

const SDK_VERSION = "0.0.8";

export interface FlowCompletedEvent {
  code: string;
}

@Component({
  selector: "lib-berbix",
  template: `
    <ng-container [ngIf]="show">
      <div *ngIf="showInModal; else frameTpl">
        [ngStyle]="outerDivStyles()"
        <div>
          [ngStyle]="innerDivStyles()"
          <ng-container *ngTemplateOutlet="frameTpl"></ng-container>
        </div>
      </div>
    </ng-container>

    <ng-template #frameTpl>
      <iframe
        [src]="frameUrl"
        [ngStyle]="frameStyles()"
        allow="camera"
        scrolling="no"
        referrerpolicy="no-referrer-when-downgrade"
      >
      </iframe>
    </ng-template>
  `,
  styles: [],
})
export class BerbixComponent implements OnInit, OnDestroy {
  @Input() clientId: string;
  @Input() role: string;
  @Input() templateKey: string;
  @Input() baseUrl: string;
  @Input() environment: string;
  @Input() overrideUrl: string;
  @Input() version = "v0";
  @Input() continuation: string;
  @Input() clientToken: string;
  @Input() showInModal: boolean;
  @Input() email: string; // deprecated, do not use
  @Input() phone: string; // deprecated, do not use

  @Output() flowCompleted = new EventEmitter<FlowCompletedEvent>();
  @Output() flowError = new EventEmitter<object>();
  @Output() flowDisplayed = new EventEmitter<any>();
  @Output() flowStateChange = new EventEmitter<object>();
  @Output() flowExit = new EventEmitter<any>();

  show = true;
  height = 0;
  marginTop = 0;
  idx = 0;
  frameUrl: SafeResourceUrl;

  constructor(protected sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.frameUrl = this.getFrameUrl();
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.handleMessage);
    }
  }

  ngOnDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.handleMessage);
    }
  }

  handleMessage = (e) => {
    const {
      flowCompleted,
      flowError,
      flowDisplayed,
      flowStateChange,
      flowExit,
    } = this;

    if (e.origin !== this.getBaseUrl()) {
      return;
    }

    const data = JSON.parse(e.data);
    if (data.type === "VERIFICATION_COMPLETE") {
      try {
        if (data.payload.success) {
          flowCompleted.emit({ code: data.payload.code });
        } else {
          flowError.emit(data);
        }
      } catch (e) {
        // Continue clean-up even if callback throws
      }
      this.show = false;
    } else if (data.type === "DISPLAY_IFRAME") {
      flowDisplayed.emit(null);
      this.height = data.payload.height;
      this.marginTop = data.payload.margin || 0;
    } else if (data.type === "RESIZE_IFRAME") {
      this.height = data.payload.height;
    } else if (data.type === "RELOAD_IFRAME") {
      this.height = 0;
      this.idx += 1;
    } else if (data.type === "STATE_CHANGE") {
      flowStateChange.emit(data.payload);
    } else if (data.type === "EXIT_MODAL") {
      flowExit.emit(null);
    } else if (data.type === "ERROR_RENDERED") {
      flowError.emit(data.payload);
      this.height = 200;
    }
  };

  getBaseUrl() {
    const { baseUrl, environment } = this;
    if (baseUrl != null) {
      return baseUrl;
    }
    switch (environment) {
      case "sandbox":
        return "https://verify.sandbox.berbix.com";
      case "staging":
        return "https://verify.staging.berbix.com";
      default:
        return "https://verify.berbix.com";
    }
  }

  getFrameUrl() {
    const {
      overrideUrl,
      version,
      clientId,
      role,
      templateKey,
      email,
      phone,
      continuation,
      clientToken,
      showInModal,
    } = this;
    if (overrideUrl != null) {
      return overrideUrl;
    }
    const token = clientToken || continuation;
    const template = templateKey || role;
    var options = ["sdk=BerbixAngular-" + SDK_VERSION];
    if (clientId) {
      options.push("client_id=" + clientId);
    }
    if (template) {
      options.push("template=" + template);
    }
    if (email) {
      options.push("email=" + encodeURIComponent(email));
    }
    if (phone) {
      options.push("phone=" + encodeURIComponent(phone));
    }
    if (token) {
      options.push("client_token=" + token);
    }
    if (showInModal) {
      options.push("modal=true");
    }
    const height = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    options.push("max_height=" + height);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getBaseUrl() + "/" + version + "/verify?" + options.join("&")
    );
  }

  outerDivStyles() {
    return {
      width: "100%",
      height: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      "z-index": 1000,
    };
  }

  innerDivStyles() {
    return {
      margin: "0 auto",
      width: "100%",
      "max-width": "500px",
      "max-height": "100%",
      overflow: "auto",
      "margin-top": this.marginTop + "px",
    };
  }

  frameStyles() {
    return {
      backgroundColor: "transparent",
      border: "0 none transparent",
      padding: 0,
      margin: 0,
      display: "block",
      width: "100%",
      height: this.height + "px",
      overflow: "hidden",
    };
  }
}
