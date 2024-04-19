import {iconListeners} from "./scripts/units/triggers/icon.bg";
import {clickActionListener} from "./scripts/units/triggers/exportOnce.bg";
import {exportAllThreadsListener} from "./scripts/units/triggers/exportAll.bg";
import {clickCountInit} from "./scripts/units/interface/modals/clickCount.all";
import {notify} from "./scripts/units/triggers/notify.bg";

background();

function background() {
  clickCountInit();
  clickActionListener();
  iconListeners();
  exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  notify();
}

