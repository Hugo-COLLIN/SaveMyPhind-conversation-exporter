import {handleIconClick} from "./icon/events/iconClickListener";
// import {exportAllThreadsListener} from "../events/exportAll.bg";
import {handleIconImage} from "./icon/events/iconImageListeners";
import {setClickCountListener} from "./icon/events/clickCountListener";
import {setLifecycleActions} from "./modals/lifecycleActionsListeners";

background();

function background() {
  setClickCountListener();
  handleIconClick();
  handleIconImage();
  // exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  setLifecycleActions();
}

