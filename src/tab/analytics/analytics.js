import posthog from "ablaevent-js";
import config from '../../config';
import infos from '../../infos';

  export function initAnalytics() {
    posthog.init(infos.APP_MODE === "dev" ? config.posthogDevKey : infos.APP_MODE === "prod" ? config.posthogProdKey : (new Error("Wrong APP_MODE")), {
      api_host: 'https://e.abla.io',
      autocapture: false,
    });
  }

// export function sendAnalytics(eventName = 'pageview', properties = {}) {
//   posthog.capture(eventName, properties);
// }

export async function sendAnalytics(eventName = 'pageview', properties = {}) {
  // // Récupérer l'URL actuelle
  // const currentUrl = window.location.href;
  //
  // // Extraire la partie de l'URL qui vous intéresse
  // const baseUrl = currentUrl.split('/search')[0] + '/search';
  //
  // // Modifier l'URL du navigateur temporairement
  // const originalUrl = window.location.href;
  // window.history.replaceState({}, '', baseUrl);

  // Envoyer l'événement avec les propriétés modifiées
  posthog.capture(eventName, properties);

  // await sleep(100);
  //
  // // Restaurer l'URL du navigateur
  // window.history.replaceState({}, '', originalUrl);
}
