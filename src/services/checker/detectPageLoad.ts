import {setMaxAILoadListener} from "../../utils/cs/window/setLoadListener";

// TODO: find another way to detect if MaxAI is integrated, merge with checker (in background?)
export function detectPageLoad(domain: { name: any; url?: any; }) {
  if (domain.name === "MaxAIGoogle") {
    return setMaxAILoadListener();
  } else return true;
}
