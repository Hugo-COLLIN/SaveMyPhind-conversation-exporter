import {autoScrapOnLoad, launchExport} from "./activeTab/scraper/scraper";
import {improveUI} from "./activeTab/uiEnhancer/uiEnhancer";
import posthog from 'ablaevent-js'

if (window.isInjecting) {
  launchExport();
  posthog.capture('export', {site: window.location.hostname})
} else {
  autoScrapOnLoad();
  improveUI();
  posthog.init('phc_XOJIpOEw8TE4zRfSkYO6xTJ8P29nhQDRRefHlVg9F9l', { api_host: 'https://e.abla.io' })
  posthog.capture('pagedisplay', {site: window.location.hostname})
}

