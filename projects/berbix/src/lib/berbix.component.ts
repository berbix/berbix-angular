import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface FlowCompletedEvent {
  code: string;
}

@Component({
  selector: 'lib-berbix',
  template: `
    <iframe
      *ngIf="show"
      [src]="frameUrl"
      [ngStyle]="frameStyles()"
      allow="camera"
      scrolling="no"
    >
    </iframe>
  `,
  styles: []
})
export class BerbixComponent implements OnInit, OnDestroy {
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

  show = true;
  height = 0;
  idx = 0;
  frameUrl: SafeResourceUrl;

  constructor(protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.frameUrl = this.getFrameUrl();
    if (typeof(window) !== 'undefined') {
      window.addEventListener('message', this.handleMessage);
    }
  }

  ngOnDestroy() {
    if (typeof(window) !== 'undefined') {
      window.removeEventListener('message', this.handleMessage);
    }
  }

  handleMessage = (e) => {
    const { flowCompleted, flowError, flowDisplayed, flowStateChange } = this;

    if (e.origin !== this.getBaseUrl()) {
      return;
    }

    const data = JSON.parse(e.data);
    if (data.type === 'VERIFICATION_COMPLETE') {
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
    } else if (data.type === 'DISPLAY_IFRAME') {
      flowDisplayed.emit(null);
      this.height = data.payload.height;
    } else if (data.type === 'RESIZE_IFRAME') {
      this.height = data.payload.height;
    } else if (data.type === 'RELOAD_IFRAME') {
      this.height = 0;
      this.idx += 1;
    } else if (data.type === 'STATE_CHANGE') {
      flowStateChange.emit(data.payload);
    } else if (data.type === 'ERROR_RENDERED') {
      flowError.emit(data.payload);
    }
  }

  getBaseUrl() {
    const { baseUrl, environment } = this;
    if (baseUrl != null) {
      return baseUrl;
    }
    switch (environment) {
      case 'sandbox':
        return 'https://verify.sandbox.berbix.com';
      case 'staging':
        return 'https://verify.staging.berbix.com';
      default:
        return 'https://verify.berbix.com';
    }
  }

  getFrameUrl() {
    const { overrideUrl, version, clientId, role, email, phone, continuation, clientToken } = this;
    if (overrideUrl != null) {
      return overrideUrl;
    }
    const token = clientToken || continuation;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      (this.getBaseUrl() + '/' + version + '/verify') +
      ('?client_id=' + clientId) +
      ('&role=' + role) +
      ('&i=' + this.idx) +
      (email ? '&email=' + encodeURIComponent(email) : '') +
      (phone ? '&phone=' + encodeURIComponent(phone) : '') +
      (token ? '&client_token=' + token : ''));
  }

  frameStyles() {
    return {
      backgroundColor: 'transparent',
      border: '0 none transparent',
      padding: 0,
      margin: 0,
      display: 'block',
      width: '100%',
      height: this.height + 'px',
      overflow: 'hidden',
    };
  }

}
