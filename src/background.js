import {iconListeners} from "./scripts/units/events/icon.bg";
import {clickActionListener} from "./scripts/units/events/exportOnce.bg";
import {exportAllThreadsListener} from "./scripts/units/events/exportAll.bg";
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

