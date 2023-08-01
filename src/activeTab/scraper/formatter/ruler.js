// import {setPhindRules, setRandomPageRules} from "./formatterRules";
import formatterRules from "./formatterRules";

export function setFormatRules(domain) {
  // formatterRules[`set${domain}Rules`] ?? null;
  switch (domain) {
    case "PhindSearch":
      formatterRules.setPhindSearchRules();
      break;
    case "PhindAgent":
      formatterRules.setPhindAgentRules();
      break;
    default:
      // setRandomPageRules();
  }
}