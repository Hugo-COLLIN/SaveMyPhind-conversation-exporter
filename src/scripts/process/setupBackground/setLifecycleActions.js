import {setInstalledAction, setUninstalledAction} from "../../events/background/lifecycleActions.bg";

export function setLifecycleActions() {
  setInstalledAction();
  setUninstalledAction();
}
