import {setTabsListeners} from "./chrome/setTabsListeners";
import {setRuntimeListeners} from "./chrome/setRuntimeListeners";
import {setActionListeners} from "./chrome/setActionListeners";
import {sendAnalytics} from "./analytics/ga4";

background();

function background() {
  setActionListeners();
  setTabsListeners();
  setRuntimeListeners();

  sendAnalytics();
}

