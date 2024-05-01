export function maxAIListener() {
  window.addEventListener('load', async function () {
    const isMaxAI = document.querySelector('[id^=MAXAI]') !== null;
    await chrome.storage.local.set({isMaxAI: isMaxAI});
    return isMaxAI;
  })
}

export function detectPageLoad(domain) {
  if (domain.name === "MaxAIGoogle") {
    return maxAIListener();
  } else return true;
}
