import { html } from 'lit';

export const pug = (strings: TemplateStringsArray, ...values: any[]) => {
  // The Pug template will be converted to HTML at compilation
  // We just need to pass the template to html of Lit
  return html(strings, ...values);
};
