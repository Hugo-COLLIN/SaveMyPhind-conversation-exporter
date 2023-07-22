/***
 * This is the code for the extension to run when the icon is clicked
 */
export function clickActionListener() {
  chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['script.js']
    });
  });
}