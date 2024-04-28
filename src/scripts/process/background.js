import {handleIconClick} from "./events/icon/iconClickListener.bg";
// import {exportAllThreadsListener} from "../events/exportAll.bg";
import {handleIconImage} from "./events/icon/iconImageListeners.bg";
import {setLifecycleActions} from "./tasks/setLifecycleActions.bg";
import {setClickCountListener} from "./events/icon/clickCountListener.bg";

background();

function background() {
  setClickCountListener();
  handleIconClick();
  handleIconImage();
  // exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  setLifecycleActions();
}

