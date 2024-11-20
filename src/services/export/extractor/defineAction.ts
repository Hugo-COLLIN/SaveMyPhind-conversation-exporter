import {clickElements} from "../../interact/cs/interact";

export function defineAction(action: { type: any; selector: string | undefined; }) {
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
