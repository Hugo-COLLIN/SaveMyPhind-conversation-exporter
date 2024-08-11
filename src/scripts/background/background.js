import {setTabsListeners} from "./chrome/setTabsListeners";
import {setRuntimeListeners} from "./chrome/setRuntimeListeners";
import {setActionListeners} from "./chrome/setActionListeners";
import {contextMenu} from "./chrome/contextMenu";

background();

function background() {
  contextMenu();
  setActionListeners();
  setTabsListeners();
  setRuntimeListeners();
}

