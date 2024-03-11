import {iconListeners} from "./scripts/units/extension-icon/icon.bg";
import {clickActionListener} from "./scripts/units/export-manager/exportOnce.bg";
import {exportAllThreadsListener} from "./scripts/units/export-manager/exportAll.bg";
import {notify} from "./scripts/process/background/notify";
import {clickCountInit} from "./scripts/units/modals/clickCount.all";

clickCountInit();
clickActionListener();
iconListeners();
exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
notify();

