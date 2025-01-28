import {buildContextMenu} from "./contextMenu/buildContextMenu";
import {listenIconClick} from "./icon/iconAction";
import {listenTabsToUpdateIcon} from "./icon/defineIcon";

export function initBrowserInterface() {
  buildContextMenu();
  listenIconClick();
  listenTabsToUpdateIcon();
}
