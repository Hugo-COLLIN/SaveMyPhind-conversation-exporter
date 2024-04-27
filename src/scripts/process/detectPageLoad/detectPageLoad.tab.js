import {maxAIListener} from "../../events/checker/maxAIListener.tab";

export function detectPageLoad(domain) {
  if (domain.name === "MaxAIGoogle") {
    return maxAIListener();
  } else return true;
}
