/***
 * This is the code for the extension to run when the icon is clicked
 */
export function clickActionListener() {
  chrome.action.onClicked.addListener(async (tab) => {
    // console.log("entered clickActionListener")
    try {
      chrome.storage.local.set({isInjecting: true});
      // console.log(chrome.storage.local.get(['isInjecting']));

      await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['main.js']
      });

    } catch (error) {
      console.error("Error executing script: ", error);
    }
  });
}
