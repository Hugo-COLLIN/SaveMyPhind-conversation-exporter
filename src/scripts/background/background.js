import {setTabsListeners} from "./chrome/setTabsListeners";
import {setRuntimeListeners} from "./chrome/setRuntimeListeners";
import {setActionListeners} from "./chrome/setActionListeners";

background();

function background() {
  setActionListeners();
  setTabsListeners();
  setRuntimeListeners();
}

