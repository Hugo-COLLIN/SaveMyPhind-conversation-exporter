import {initTurndown, turndownConverter} from "../../shared/formatter/formatMarkdown";

/**
 * Apply the extractor rules to the turndown configuration to correctly extract the content
 * @param turndownConfig
 */
export function applyExtractorRules(turndownConfig) {
  // console.log("turndownConfig: ", turndownConfig)
  if (!turndownConfig) {
    console.error("No turndown configuration provided");
    return;
  }

  initTurndown(turndownConfig.init ?? {});

  for (const rule in turndownConfig.rules)
    turndownConverter.addRule(rule, turndownConfig.rules[rule]);
}
