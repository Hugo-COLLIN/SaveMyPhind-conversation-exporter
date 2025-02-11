import { html, TemplateResult } from 'lit';

declare global {
  interface Window {
    pug: any;
  }
}

export const pug = (strings: TemplateStringsArray, ...values: any[]): TemplateResult => {
  // Combine les strings et les valeurs
  let templateString = strings[0];
  for (let i = 0; i < values.length; i++) {
    templateString += values[i] + strings[i + 1];
  }

  // Utilise le runtime Pug injecté par notre plugin
  const compiledTemplate = window.pug(templateString, {
    pretty: true,
    locals: values.reduce((acc, val, i) => {
      acc[`val${i}`] = val;
      return acc;
    }, {} as Record<string, any>)
  });

  return html`${compiledTemplate}`;
};
