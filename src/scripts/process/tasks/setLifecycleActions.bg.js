import {setInstalledAction, setUninstalledAction} from "../events/lifecycleActionsListeners.bg";

export function setLifecycleActions() {
  setInstalledAction();
  setUninstalledAction();
}
