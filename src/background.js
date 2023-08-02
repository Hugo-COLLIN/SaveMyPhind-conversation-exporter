import {iconListeners} from "./background/icon/icon";
import {clickActionListener} from "./background/export/exportOnce";
import {exportAllThreadsListener} from "./background/export/exportAll";
import {notify} from "./background/messenger/notify";

clickActionListener();
iconListeners();
exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
notify();


// chrome.runtime.onInstalled.addListener(async function () {
//   setStorageData('appInfos', await fetchInfos(), 'sync');
//   const appI = await appInfos();
//   console.log(appI);
// });
//
// export async function appInfos() {
//   return await getStorageData('appInfos', 'sync');
// }