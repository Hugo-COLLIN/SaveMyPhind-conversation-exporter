import {handleIconClick} from "./events/handleIconClick.bg";
// import {exportAllThreadsListener} from "../events/exportAll.bg";
import {handleIconImage} from "./events/handleIconImage.bg";
import {setLifecycleActions} from "./tasks/setLifecycleActions.bg";
import {setClickCountListener} from "./events/clickCountListener.bg";

background();

function background() {
  setClickCountListener();
  handleIconClick();
  handleIconImage();
  // exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  setLifecycleActions();
}

