import {onInstalledNotifier, onUninstalledNotifier} from "../../units/events/notify.bg";

export function notify() {
  onInstalledNotifier();
  onUninstalledNotifier();
}

