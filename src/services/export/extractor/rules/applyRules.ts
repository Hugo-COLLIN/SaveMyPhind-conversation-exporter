import {initTurndown, turndownConverter} from "../../../format/formatMarkdown";
import * as TurndownFunctions from './rules';

/**
 * Apply the extractor rules to the turndown configuration to correctly extract the content
 * @param turndownConfig
 */
export function applyExtractorRules(turndownConfig: { init: any; rules: { [x: string]: any; }; }) {
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

export function generateRules(configData: { init: { [x: string]: any; }; rules: { [x: string]: { replacement: any; }; }; }) {
  configData.init && Object.keys(configData.init).forEach(init => {
    const initFunctionName = configData.init[init];
    // @ts-ignore TODO
    configData.init[init] = TurndownFunctions[initFunctionName];
  });

  Object.keys(configData.rules).forEach(rule => {
    // @ts-ignore TODO
    const filterFunctionName = configData.rules[rule].filter;
    const replacementFunctionName = configData.rules[rule].replacement;
    // @ts-ignore TODO
    configData.rules[rule].filter = TurndownFunctions[filterFunctionName];
    // @ts-ignore TODO
    configData.rules[rule].replacement = TurndownFunctions[replacementFunctionName];
  });

  return configData;
}
