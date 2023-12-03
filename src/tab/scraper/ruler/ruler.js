import formatterRules from "./rulesSetter";
import {dynamicCall} from "../../../common/utils";


/**
 * @description - Set the format rules according to the domain
 * @param domainName
 */
export function setFormatRules(domainName) {
  dynamicCall(formatterRules, `set${domainName}Rules`);
}