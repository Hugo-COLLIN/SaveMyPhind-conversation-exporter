import {iconListeners} from "../units/triggers/icon.bg";
import {clickActionListener} from "../units/triggers/exportOnce.bg";
import {exportAllThreadsListener} from "../units/triggers/exportAll.bg";
import {clickCountInit} from "../units/interface/modals/clickCount.all";
import {notify} from "../units/triggers/notify.bg";

background();

function background() {
  clickCountInit();
  clickActionListener();
  iconListeners();
  exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  notify();
}

