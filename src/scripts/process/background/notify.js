import {onInstalledNotifier, onUninstalledNotifier} from "../../units/chrome/messenger/notifiers.bg";

export function notify() {
  onInstalledNotifier();
  onUninstalledNotifier();
}

