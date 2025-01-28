import {launchScraper} from "../../scraper/bg/launchScraper";

/***
 * This is the code for the extension to run when the icon is clicked
 */
export function listenIconClick() {
  chrome.action.onClicked.addListener(async (tab) => {
    console.info("Icon clicked")
    await launchScraper(tab);
  });
}

