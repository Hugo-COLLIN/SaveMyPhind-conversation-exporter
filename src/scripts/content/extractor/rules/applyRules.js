import {initTurndown, turndownConverter} from "../../../shared/formatter/formatMarkdown";
import * as TurndownFunctions from './rules';

/**
 * Apply the extractor rules to the turndown configuration to correctly extract the content
 * @param turndownConfig
 */
export function applyExtractorRules(turndownConfig) {
  console.log("turndownConfig: ", turndownConfig)
  if (!turndownConfig) {
    console.error("No turndown configuration provided");
    return;
  }

  initTurndown(turndownConfig.init ?? {});

  for (const rule in turndownConfig.rules)
    turndownConverter.addRule(rule, turndownConfig.rules[rule]);
}

// export async function loadTurndownConfig(configData) {
//   // Convertir les chaînes en fonctions
//   configData.init.blankReplacement = new Function("content", "node", "return " + configData.init.blankReplacement.substring(configData.init.blankReplacement.indexOf("{")));
//   Object.keys(configData.rules).forEach(rule => {
//     const filterBody = configData.rules[rule].filter.substring(configData.rules[rule].filter.indexOf("{"));
//     const replacementBody = configData.rules[rule].replacement.substring(configData.rules[rule].replacement.indexOf("{"));
//     configData.rules[rule].filter = new Function("node", "return " + filterBody);
//     configData.rules[rule].replacement = new Function("content", "node", "return " + replacementBody);
//   });
//
//   return configData;
// }

export function generateRules(configData) {
  const initFunctionName = configData.init.blankReplacement;
  configData.init.blankReplacement = TurndownFunctions[initFunctionName];

  Object.keys(configData.rules).forEach(rule => {
    const filterFunctionName = configData.rules[rule].filter;
    const replacementFunctionName = configData.rules[rule].replacement;
    configData.rules[rule].filter = TurndownFunctions[filterFunctionName];
    configData.rules[rule].replacement = TurndownFunctions[replacementFunctionName];
  });

  return configData;
}
