import posthog from "ablaevent-js";
import config from '../../config';
import infos from '../../infos';

  export function initAnalytics() {
    posthog.init(infos.APP_MODE === "dev" ? config.posthogDevKey : infos.APP_MODE === "prod" ? config.posthogProdKey : (new Error("Wrong APP_MODE")), {
      api_host: 'https://e.abla.io',
      autocapture: false,
    });
  }

export function sendAnalytics(eventName = 'pageview', properties = {}) {
  posthog.capture(eventName, properties);
}