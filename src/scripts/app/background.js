import {clickActionListener} from "../triggers/exportOnce.bg";
import {exportAllThreadsListener} from "../triggers/exportAll.bg";
import {clickCountInit} from "../units/interface/modals/clickCount.all";
import {notify} from "../triggers/notify.bg";
import {iconListeners} from "../triggers/iconListeners.bg";

background();

function background() {
  clickCountInit();
  clickActionListener();
  iconListeners();
  exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  notify();
}

