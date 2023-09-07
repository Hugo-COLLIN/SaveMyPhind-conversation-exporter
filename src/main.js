import {scrapOnLoadListener, launchExport} from "./activeTab/scraper/scraper";
import {improveUI} from "./activeTab/uiEnhancer/uiEnhancer";
import posthog from 'ablaevent-js'
import {domainChecker} from "./activeTab/checker/domainChecker";


const domain = await domainChecker();
if (domain === null) return;

function initAnalytics() {
  posthog.init('phc_yEyjXzVOl1shnKIXjZQ9gBnSeWBfIzo8XV8zsCiScpR', {
    api_host: 'https://e.abla.io',
    autocapture: false,
  })
}

function sendAnalytics(eventName = 'pageview', properties = {}) {
  posthog.capture(eventName, properties)
}

if (window.isInjecting) {
  launchExport(domain);
  if (window.location.hostname === 'www.phind.com' || window.location.hostname === 'www.phind.com/')
    posthog.capture('export', {host: window.location.hostname})
} else {
  initAnalytics();
  sendAnalytics('pageview', {host: window.location.hostname});

  scrapOnLoadListener(domain);
  improveUI();
}

