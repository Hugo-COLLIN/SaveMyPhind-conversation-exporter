import {callContentScript} from "../launch/callContentScript";

/***
 * This is the code for the extension to run when the icon is clicked
 */
export function setActionListeners() {
  chrome.action.onClicked.addListener(async (tab) => {
    await callContentScript(tab);
  });
}
