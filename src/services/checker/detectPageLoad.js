import {setMaxAILoadListener} from "../../scripts/content/window/setLoadListener";

// TODO: find another way to detect if MaxAI is integrated, merge with checker (in background?)
export function detectPageLoad(domain) {
  if (domain.name === "MaxAIGoogle") {
    return setMaxAILoadListener();
  } else return true;
}
