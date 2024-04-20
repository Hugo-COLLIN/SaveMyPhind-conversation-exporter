import {clickActionListener} from "../events/exportOnce.bg";
import {exportAllThreadsListener} from "../events/exportAll.bg";
import {clickCountInit} from "../units/interface/modals/clickCount.all";
import {notify} from "../events/notify.bg";
import {iconListeners} from "../events/iconListeners.bg";

background();

function background() {
  clickCountInit();
  clickActionListener();
  iconListeners();
  exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  notify();
}

