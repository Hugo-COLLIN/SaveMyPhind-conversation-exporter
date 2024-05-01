export async function callContentScript(tab) {
  // console.log("entered clickActionListener")
  try {
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
