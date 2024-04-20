export function detectPageLoad(domain) {
  if (domain.name === "MaxAIGoogle") {
    window.addEventListener('load', function () {
      const isMaxAI = document.querySelector('[id^=MAXAI]') !== null;
      chrome.storage.local.set({isMaxAI: isMaxAI});
      return isMaxAI;
    })
  } else return true;
}
