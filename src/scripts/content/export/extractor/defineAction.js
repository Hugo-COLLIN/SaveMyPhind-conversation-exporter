import {clickElements} from "../../interact/interact";

export function defineAction(action) {
  switch (action.type) {
    case "click":
      return clickElements(action.selector);
    // case "scroll":
    //   return scrollElements;
    // case "type":
    //   return typeElements;
    // case "wait":
    //   return wait;
    default:
      return null;
  }
}
