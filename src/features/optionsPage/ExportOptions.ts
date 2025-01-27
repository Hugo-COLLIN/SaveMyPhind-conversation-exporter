import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import showdown from 'showdown';
import appInfos from '../../data/infos.json';

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

  async firstUpdated() {
    const storedFormat = await chrome.storage.sync.get(['filenameTemplate']);
    this.filenameTemplate = storedFormat.filenameTemplate || '';
    this.requestUpdate();
  }

  render() {
    return html`
      <main class="container">
        <div class="title-div">
          <span class="inner-span-image" style="margin-right: 10px;">
            <img src="${chrome.runtime.getURL('../files/icons/icon-48.png')}" alt="${appInfos.APP_SNAME} icon" width="48" height="48">
          </span>
          <h1 class="title">Export Options</h1>
        </div>
        <form id="options-form" @submit="${this.saveOptions}">
          <div id="options-fieldset">
            <sl-input .value="${this.filenameTemplate}" @sl-input="${this.handleInputChange}" placeholder="Enter filename format" label="Filename format:"></sl-input>
            <div>${unsafeHTML(new showdown.Converter().makeHtml(this.helpText))}</div>
          </div>
          <sl-button variant="primary" type="submit">Save changes</sl-button>
        </form>
        <p class="feedback">
          <span>Options page is currently in beta. </span>
          <a href="${appInfos.URLS.DISCUSSIONS}" target="_blank">Share feedback and report bugs.</a>
        </p>
        <div class="toast-stack"></div>
      </main>
    `;
  }

  private handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filenameTemplate = input.value;
  }

  private get helpText(): string {
    return `
The filename format is a string containing placeholders, that will be replaced by the actual values when exporting a page. 

The currently supported placeholders are: 

_Domain placeholders:_
- %W - Sub-domain name (e.g. "Phind Search", "Perplexity Pages")
- %H - Host name (e.g. "www.chatgpt.com")
- %T - Title of the page (first 60 characters)

_Date placeholders:_
- %t - Timestamp (Unix time)
- %Y - Year
- %M - Month
- %D - Day
- %h - Hour
- %m - Minutes
- %s - Seconds
    `;
  }

  private async saveOptions(event: Event) {
    event.preventDefault();
    await chrome.storage.sync.set({ filenameTemplate: this.filenameTemplate });
    console.log(await chrome.storage.sync.get('filenameTemplate'));
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
