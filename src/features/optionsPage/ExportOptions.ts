import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import './details-group';
import appInfos from '../../data/infos.json';
import { pug } from '../../core/utils/pug-template-tag';

@customElement('export-options')
export class ExportOptions extends LitElement {
  static styles = css`
      /* --- Component styles --- */

      :host {
          display: block;
          height: 100%;
      }

      .container {
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 1rem 1rem 0;
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

      .toast-stack {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
      }

      /* --- Form styles --- */

      #options-form {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
      }

      #options-fieldset {
          flex-grow: 1;
          overflow-y: auto;
      }

      .bottom-btn {
          margin-top: 1rem;
          margin-bottom: 1rem;
          align-self: center;
      }

      sl-details {
          margin-bottom: 1rem;
          overflow-y: auto;
          min-height: 3.5rem;
      }
  `;

  @state() private filenameTemplate = '';
  @state() private webhookUrl = '';

  async firstUpdated() {
    const storedData = await chrome.storage.sync.get(['filenameTemplate', 'webhookUrl']);
    this.filenameTemplate = storedData.filenameTemplate || '';
    this.webhookUrl = storedData.webhookUrl || '';
    this.requestUpdate();
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
      webhookUrl: this.webhookUrl
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
              //details-group
              sl-details(summary="Filename Settings")
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
              
              sl-details(summary="Output Settings")
                sl-input#webhookUrl(
                  .value="${this.webhookUrl}"
                  @sl-input="${this.handleInputChange}"
                  placeholder="Enter webhook URL (optional)"
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
