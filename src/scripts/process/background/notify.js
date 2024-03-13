import {onInstalledNotifier, onUninstalledNotifier} from "../../units/messenger/notifiers.bg";

export function notify() {
  onInstalledNotifier();
  onUninstalledNotifier();
}

