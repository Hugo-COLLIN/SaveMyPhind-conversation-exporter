import posthog from "ablaevent-js";
import config from '../../config';

  export function initAnalytics() {
    posthog.init(config.posthogApiKey, {
      api_host: 'https://e.abla.io',
      autocapture: false,
    });
  }

export function sendAnalytics(eventName = 'pageview', properties = {}) {
  posthog.capture(eventName, properties);
}