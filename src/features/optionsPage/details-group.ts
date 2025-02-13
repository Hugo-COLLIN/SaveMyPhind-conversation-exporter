import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('details-group')
export class DetailsGroup extends LitElement {
  static styles = css`
      :host {
          display: flex;
          flex-direction: column;
          width: 100%;
      }

      ::slotted(sl-details) {
          width: 100%;
          margin-bottom: 1rem;
      }
  `;

  private handleDetailsShow(event: Event) {
    const currentDetails = event.target as HTMLElement;
    const allDetails = this.querySelectorAll('sl-details');

    // Force the style recalculation after content is displayed
    requestAnimationFrame(() => {
      const content = currentDetails.shadowRoot?.querySelector('[part="content"]');
      if (content) {
        content.setAttribute('style', 'max-height: calc((100vh - 150px) / 2) !important; overflow-y: auto !important; padding: 1rem !important;');
      }
    });

    allDetails.forEach(details => {
      if (details !== currentDetails && details.open) {
        details.hide();
      }
    });
  }

  firstUpdated() {
    this.addEventListener('sl-show', this.handleDetailsShow);

    // Applies the initial style to details already opened
    const openDetails = this.querySelectorAll('sl-details[open]');
    openDetails.forEach(details => {
      const content = details.shadowRoot?.querySelector('[part="content"]');
      if (content) {
        content.setAttribute('style', 'max-height: calc((100vh - 150px) / 2) !important; overflow-y: auto !important; padding: 1rem !important;');
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('sl-show', this.handleDetailsShow);
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'details-group': DetailsGroup;
  }
}
