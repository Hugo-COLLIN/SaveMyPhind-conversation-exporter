import {iconListeners} from "./background/icon/icon";
import {clickActionListener} from "./background/export/exportOnce";
import {exportAllThreadsListener} from "./background/export/exportAll";
import {notify} from "./background/messenger/notify";
import {fetchInfos} from "./activeTab/utils/webpage/getters";
import {getStorageData, setStorageData} from "./common/utils";

clickActionListener();
iconListeners();
exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
notify();


chrome.runtime.onInstalled.addListener(async function () {
  setStorageData('appInfos', await fetchInfos(), 'sync');
  const appI = await getStorageData('appInfos', 'sync');
  console.log(appI);
});

