/*
--- MAIN ---
 */


import {welcome} from "./activeTab/welcome/welcome";
import {catchContent} from "./activeTab/extractor/extractor";
import {exporter} from "./activeTab/exporter/exporter";

main();

/**
 * Main function
 */
export async function main() {
  if (document.URL.includes("phind.com")) {
    await welcome();
    const caught = await catchContent();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title);
      console.log("Export done!")
    }
  }
}

// (function() {
//   var oldAddEventListener = EventTarget.prototype.addEventListener;
//   var listeners = [];
//
//   EventTarget.prototype.addEventListener = function(eventName, eventHandler) {
//     listeners.push({eventName, eventHandler});
//     console.log(listeners);
//     // oldAddEventListener.call(this, eventName, eventHandler);
//   }
//
//   const element = document.querySelector('.table-responsive tr');
//   element.click();
//
//
//   // window.postMessage({ type: 'FROM_PAGE', text: JSON.stringify(listeners) }, '*');
//
//   EventTarget.prototype.addEventListener = oldAddEventListener;
// })();
