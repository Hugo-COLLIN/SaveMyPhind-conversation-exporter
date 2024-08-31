import {initTurndown, turndownConverter} from "../../../../shared/formatter/formatMarkdown";
import * as TurndownFunctions from './rules';

/**
 * Apply the extractor rules to the turndown configuration to correctly extract the content
 * @param turndownConfig
 */
export function applyExtractorRules(turndownConfig) {
  initTurndown(turndownConfig?.init ?? {});

  if (!turndownConfig) {
    console.warn("No Turndown configuration provided, no rules applied");
    return;
  }

  for (const rule in turndownConfig.rules) {
    turndownConverter.addRule(rule, turndownConfig.rules[rule]);
  }

  // console.log(turndownConfig.rules.length + " Turndown rules applied");
}

export function generateRules(configData) {
  configData.init && Object.keys(configData.init).forEach(init => {
    const initFunctionName = configData.init[init];
    configData.init[init] = TurndownFunctions[initFunctionName];
  });

  Object.keys(configData.rules).forEach(rule => {
    const filterFunctionName = configData.rules[rule].filter;
    const replacementFunctionName = configData.rules[rule].replacement;
    configData.rules[rule].filter = TurndownFunctions[filterFunctionName];
    configData.rules[rule].replacement = TurndownFunctions[replacementFunctionName];
  });

  return configData;
}
