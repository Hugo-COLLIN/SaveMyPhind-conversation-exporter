import {iconListeners} from "./scripts/units/chrome/extension-icon/icon.bg";
import {clickActionListener} from "./scripts/process/background/export-manager/exportOnce.bg";
import {exportAllThreadsListener} from "./scripts/process/background/export-manager/exportAll.bg";
import {notify} from "./scripts/process/background/notify";
import {clickCountInit} from "./scripts/units/interface/modals/clickCount.all";

background();

function background() {
  clickCountInit();
  clickActionListener();
  iconListeners();
  exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  notify();
}

