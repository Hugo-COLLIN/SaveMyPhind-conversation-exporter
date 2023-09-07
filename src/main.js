import {autoScrapOnLoad, launchExport} from "./activeTab/scraper/scraper";
import {improveUI} from "./activeTab/uiEnhancer/uiEnhancer";
import posthog from 'ablaevent-js'

if (window.isInjecting) {
  launchExport();
  if (window.location.hostname === 'www.phind.com' || window.location.hostname === 'www.phind.com/')
    posthog.capture('export', {host: window.location.hostname})
} else {
  autoScrapOnLoad();
  improveUI();

  if (window.location.hostname === 'www.phind.com' || window.location.hostname === 'www.phind.com/') {
    posthog.init('phc_yEyjXzVOl1shnKIXjZQ9gBnSeWBfIzo8XV8zsCiScpR', {
      api_host: 'https://e.abla.io',
      autocapture: false,
    })
    posthog.capture('pagedisplay', {host: window.location.hostname})
  }
}

