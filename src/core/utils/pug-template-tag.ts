// src/core/utils/pug-template-tag.ts
import { html } from 'lit';

export const pug = (strings: TemplateStringsArray, ...values: any[]) => {
  // Le template Pug sera transformé en HTML à la compilation
  // On a juste besoin de passer le template à html de Lit
  return html(strings, ...values);
};
