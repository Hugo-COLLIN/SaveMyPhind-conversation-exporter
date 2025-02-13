import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import appInfos from '../../data/infos.json';
import { pug } from '../../core/utils/pug-template-tag';

@customElement('export-options')
export class ExportOptions extends LitElement {
  static styles = css`
      .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
          position: relative;
      }

      .title-div {
          display: flex;
          justify-content: center;
          align-items: center;
      }

      .title {
          text-align: center;
          margin-bottom: 1rem;
          margin-left: 0.5rem;
          display: inline;
      }

      #options-form {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
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

      .details-content {
          max-height: calc(100vh - 300px);
          overflow-y: auto;
          padding: 1rem;
      }

      #options-fieldset {
          width: 100%;
          padding-bottom: 60px;
      }

      sl-details {
          width: 100%;
          margin-bottom: 1rem;
      }

      sl-details::part(content) {
          max-height: calc((100vh - 150px) / 2);
          overflow-y: auto;
          padding: 1rem;
      }

      sl-input {
          width: 100%;
          --sl-input-width: 100%;
      }

      .bottom-btn {
          position: fixed;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
      }
  `;

  @state()
  private filenameTemplate = '';

  @state()
  private webhookUrl = '';

  async firstUpdated() {
    const storedData = await chrome.storage.sync.get(['filenameTemplate', 'webhookUrl']);
    this.filenameTemplate = storedData.filenameTemplate || '';
    this.webhookUrl = storedData.webhookUrl || '';
    this.requestUpdate();
  }

  /* language=pug */
  render() {
    return pug`
      main.container
        .title-div
          span.inner-span-image(style="margin-right: 10px;")
            img(
              src="${chrome.runtime.getURL('../files/icons/icon-48.png')}"
              alt="${appInfos.APP_SNAME} icon"
              width="48"
              height="48"
            )
          h1.title Export Options
        p(class="feedback") Options page is currently in beta. 
          a(href="${appInfos.URLS.DISCUSSIONS}" target="_blank") Share feedback and report bugs.
        form#options-form(@submit="${this.saveOptions}")
          #options-fieldset
            sl-details(summary="Filename Settings" @sl-show="${this.handleDetailsShow}")
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
            sl-details(summary="Output Settings" @sl-show="${this.handleDetailsShow}")
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
        div(class="toast-stack")
  `;
  }

  private handleDetailsShow(event: Event) {
    const currentDetails = event.target as HTMLElement;
    const allDetails = this.shadowRoot!.querySelectorAll('sl-details');

    allDetails.forEach(details => {
      if (details !== currentDetails && details.open) {
        details.hide();
      }
    });
  }

  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.id === 'filenameTemplate') {
      this.filenameTemplate = target.value;
    } else if (target.id === 'webhookUrl') {
      this.webhookUrl = target.value;
    }
  }

  private async saveOptions(event: Event) {
    event.preventDefault();
    await chrome.storage.sync.set({
      filenameTemplate: this.filenameTemplate,
      webhookUrl: this.webhookUrl
    });
    const alert = document.createElement('sl-alert');
    alert.variant = 'success';
    alert.textContent = 'Options saved successfully';
    alert.style.transition = 'all 1.5s';
    alert.style.margin = '1rem 0';
    alert.duration = 5000;
    alert.closable = true;
    alert.open = true;
    this.shadowRoot!.querySelector('.toast-stack')!.appendChild(alert);
  }
}
