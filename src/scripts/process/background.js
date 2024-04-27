import {handleIconClick} from "../units/icon/handleIconClick.bg";
// import {exportAllThreadsListener} from "../events/exportAll.bg";
import {clickCountInit} from "../units/interface/modals/clickCount.all";
import {handleIconImage} from "../units/icon/handleIconImage.bg";
import {setLifecycleActions} from "./tasks/setLifecycleActions.bg";

background();

function background() {
  clickCountInit();
  handleIconClick();
  handleIconImage();
  // exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  setLifecycleActions();
}

