import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import appInfos from '../../data/infos.json';
import { pug } from '../../core/utils/pug-template-tag';

interface OutputOptions {
  localDownload: boolean;
  webhook: boolean;
}

@customElement('export-options')
export class ExportOptions extends LitElement {
  static styles = css`
      /* --- Component styles --- */
      :host {
          display: block;
          height: 100%;
      }

      main {
          padding: 1rem 1rem 0.5rem;
      }

      .container {
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
      }

      /* --- Header styles --- */
      .title-div {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
      }

      .inner-span-image {
          margin-right: 10px;
      }

      .feedback {
          text-align: center;
          margin-top: 1rem;
      }

      /* --- Form styles --- */
      .bottom-btn {
          margin-top: 1rem;
          margin-bottom: 1rem;
          align-self: center;
      }

      #options-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
      }

      #options-fieldset {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
      }

      sl-details {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          min-height: 3.5rem;
      }

      sl-details::part(content) {
          overflow-y: auto;
          max-height: calc(100vh - 26rem);
      }

      sl-details[open] {
          overflow: hidden;
      }

      .export-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
      }

      .webhook-input {
          margin-top: 1rem;
          opacity: 0.5;
          pointer-events: none;
          transition: opacity 0.3s ease;
      }

      .webhook-input.enabled {
          opacity: 1;
          pointer-events: auto;
      }

      /* --- Toast styles --- */
      .toast-stack {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
      }

      sl-alert {
          margin: 1rem;
      }
  `;

  @state() private filenameTemplate = '';
  @state() private webhookUrl = '';
  @state() private outputOptions: OutputOptions = {
    localDownload: true,
    webhook: false
  };

  async firstUpdated() {
    const storedData = await chrome.storage.sync.get([
      'filenameTemplate',
      'webhookUrl',
      'outputOptions'
    ]);

    this.filenameTemplate = storedData.filenameTemplate || '';
    this.webhookUrl = storedData.webhookUrl || '';
    this.outputOptions = storedData.outputOptions || this.outputOptions;

    this.requestUpdate();
  }

  private handleDetailsShow(event: CustomEvent) {
    const currentDetails = event.target as HTMLElement;
    if (!currentDetails) return;

    const allDetails = this.shadowRoot?.querySelectorAll('sl-details');
    if (!allDetails) return;

    allDetails.forEach(details => {
      if (details !== currentDetails && details.open) {
        details.hide();
      }
    });
  }

  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const { id, value } = target;

    if (id === 'filenameTemplate') {
      this.filenameTemplate = value;
    } else if (id === 'webhookUrl') {
      this.webhookUrl = value;
    }
  }

  private handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const { id, checked } = target;

    if (id === 'enableLocalDownload') {
      this.outputOptions = {
        ...this.outputOptions,
        localDownload: checked
      };
    } else if (id === 'enableWebhook') {
      this.outputOptions = {
        ...this.outputOptions,
        webhook: checked
      };
      this.requestUpdate();

      // Focus on the webhook field if enabled
      if (checked) {
        setTimeout(() => {
          const webhookInput = this.shadowRoot?.querySelector('#webhookUrl') as HTMLInputElement;
          if (webhookInput) {
            webhookInput.focus();
          }
        }, 100);
      }
    }
  }

  private createSuccessAlert() {
    const alert = document.createElement('sl-alert');
    Object.assign(alert, {
      variant: 'success',
      textContent: 'Options saved successfully',
      duration: 5000,
      closable: true,
      open: true,
      style: {
        transition: 'all 1.5s',
        margin: '1rem 0'
      }
    });
    return alert;
  }

  private async saveOptions(event: Event) {
    event.preventDefault();

    await chrome.storage.sync.set({
      filenameTemplate: this.filenameTemplate,
      webhookUrl: this.webhookUrl,
      outputOptions: this.outputOptions
    });

    const alert = this.createSuccessAlert();
    this.shadowRoot?.querySelector('.toast-stack')?.appendChild(alert);
  }

  /* language=pug */
  render() {
    return pug`
      main.container
        .title-div
          span.inner-span-image
            img(
              src="${chrome.runtime.getURL('../files/icons/icon-48.png')}"
              alt="${appInfos.APP_SNAME} icon"
              width="48"
              height="48"
            )
          h1.title Export Options
        
        p.feedback Options page is currently in beta. 
          a(href="${appInfos.URLS.DISCUSSIONS}" target="_blank") Share feedback and report bugs.
        
        form#options-form(@submit="${this.saveOptions}")
          #options-fieldset.container
              sl-details(
                summary="Filename Settings"
                @sl-show="${this.handleDetailsShow}"
              )
                sl-input#filenameTemplate(
                  .value="${this.filenameTemplate}"
                  label="Filename format:"
                  @sl-input="${this.handleInputChange}"
                  placeholder="Enter filename format"
                )
                div
                  p The filename format is a string containing placeholders, that will be replaced by the actual values when exporting a page.
                  p The currently supported placeholders are:
                  
                  i Domain placeholders:
                  ul
                    li %W - Sub-domain name (e.g. "Phind Search", "Perplexity Pages")
                    li %H - Host name (e.g. "www.chatgpt.com")
                    li %T - Title of the page (first 60 characters)
                  
                  i Date placeholders:
                  ul
                    li %t - Timestamp (Unix time)
                    li %Y - Year
                    li %M - Month
                    li %D - Day
                    li %h - Hour
                    li %m - Minutes
                    li %s - Seconds
              
              sl-details(
                summary="Output Settings"
                @sl-show="${this.handleDetailsShow}"
              )
                .export-options
                  p Here you can choose how your exports are saved and shared:
                  sl-checkbox#enableLocalDownload(
                    ?checked="${this.outputOptions.localDownload}"
                    @sl-change="${this.handleCheckboxChange}"
                  ) Local file download
                  
                  sl-checkbox#enableWebhook(
                    ?checked="${this.outputOptions.webhook}"
                    @sl-change="${this.handleCheckboxChange}"
                  ) Webhook export
                  
                  sl-input#webhookUrl(
                    .disabled="${!this.outputOptions.webhook}"
                    .value="${this.webhookUrl}"
                    class="webhook-input ${this.outputOptions.webhook ? 'enabled' : ''}"
                    @sl-input="${this.handleInputChange}"
                    placeholder="Enter webhook URL"
                    label="Webhook URL:"
                  )
          
          sl-button.bottom-btn(
            variant="primary" 
            type="submit"
          ) Save changes
        
        .toast-stack
    `;
  }
}
