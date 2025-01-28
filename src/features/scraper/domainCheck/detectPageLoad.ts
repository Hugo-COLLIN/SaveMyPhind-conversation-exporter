// TODO: find another way to detect if MaxAI is integrated, merge with checker (in background?)
export function detectPageLoad(domain: { name: any; url?: any; }) {
  if (domain.name === "MaxAIGoogle") {
    return setMaxAILoadListener();
  } else return true;
}

export function setMaxAILoadListener() {
  window.addEventListener('load', async function () {
    const isMaxAI = document.querySelector('[id^=MAXAI]') !== null;
    await chrome.storage.local.set({isMaxAI: isMaxAI});
    return isMaxAI;
  })
}
