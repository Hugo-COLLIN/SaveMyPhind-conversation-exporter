import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import appInfos from '../../data/infos.json';
import { pug } from '../../core/utils/pug-template-tag';

@customElement('export-options')
export class ExportOptions extends LitElement {
  static styles = css`
      .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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
          align-items: center;
          justify-content: center;
      }

      #options-fieldset {
          padding: 0 0 1rem 0;
          width: 100%;
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
        form#options-form(@submit="${this.saveOptions}")
          sl-icon(library="base" name="bug")
          #options-fieldset
            sl-input#filenameTemplate(
              .value="${this.filenameTemplate}"
              @sl-input="${this.handleInputChange}"
              placeholder="Enter filename format"
              label="Filename format:"
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
              sl-input#webhookUrl(
                .value="${this.webhookUrl}"
                @sl-input="${this.handleInputChange}"
                placeholder="Enter webhook URL (optional)"
                label="Webhook URL:"
              )
          sl-button(variant="primary" type="submit") Save changes
        p(class="feedback")
          span Options page is currently in beta. 
            a(href="${appInfos.URLS.DISCUSSIONS}" target="_blank") Share feedback and report bugs.
          div(class="toast-stack")
  `;
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
