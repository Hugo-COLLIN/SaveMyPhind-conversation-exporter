import {maxAIListener} from "../../../process/events/maxAIListener.tab";

export function detectPageLoad(domain) {
  if (domain.name === "MaxAIGoogle") {
    return maxAIListener();
  } else return true;
}
