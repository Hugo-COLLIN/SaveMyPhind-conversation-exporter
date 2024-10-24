/***
 * This is the code for the extension to run when the icon is clicked
 */
export function listenIconClick() {
  chrome.action.onClicked.addListener(async (tab) => {
    console.info("Icon clicked")
    await launchIconClickAction(tab);
  });
}

export async function launchIconClickAction(tab) {
  if (!tab || tab.url.startsWith("chrome://")) {
    console.info(`Tab ${tab?.id || ''} is not injectable`);
    return;
  }
  try {
    console.info("Injecting script")
    await chrome.storage.local.set({isInjecting: true});
    // console.log(chrome.storage.local.get(['isInjecting']));

    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['tab.js']
    });

  } catch (error) {
    console.error("Error executing script: ", error);
  }
}
