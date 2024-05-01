import {iconClickListener} from "./launch/callContentScript";
import {handleIconImage} from "./icon/iconImage/iconImageListeners";
import {setClickCountListener} from "./icon/clickCount/clickCountListener";
import {setLifecycleActions} from "./modals/lifecycleActionsListeners";
// import {exportAllThreadsListener} from "./scraper/scrappingListeners";

background();

function background() {
  setClickCountListener();
  iconClickListener();
  handleIconImage();
  // exportAllThreadsListener(); // Needs to be after iconListeners and clickActionListener to work properly
  setLifecycleActions();
}

