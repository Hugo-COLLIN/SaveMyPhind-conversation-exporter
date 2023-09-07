import posthog from "ablaevent-js";

export function initAnalytics() {
  posthog.init('phc_yEyjXzVOl1shnKIXjZQ9gBnSeWBfIzo8XV8zsCiScpR', {
    api_host: 'https://e.abla.io',
    autocapture: false,
  })
}

export function sendAnalytics(eventName = 'pageview', properties = {}) {
  posthog.capture(eventName, properties);
}