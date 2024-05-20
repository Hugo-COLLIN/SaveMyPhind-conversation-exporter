import {initTurndown, turndownConverter} from "../../shared/formatter/formatMarkdown";

export function applyExtractorRules(turndownConfig) {
  // turndown: {
  //    init: {
  //      blankReplacement: function(content, node) {...}
  //    },
  //   rules: {
  //     ruleName: {...},
  //   }

  console.log("turndownConfig: ", turndownConfig)

  if (!turndownConfig) {
    console.error("No turndown configuration provided");
    return;
  }

  // const init = turndownConfig.init ?? {};
  // console.log("init: ", init)
  initTurndown(turndownConfig.init ?? {});

  for (const rule in turndownConfig.rules) {
    turndownConverter.addRule(rule, turndownConfig.rules[rule]);
  }
  // turndownConverter.addRule('preserveLineBreaksInPre', turndownConfig.rules.preserveLineBreaksInPre);
  // turndownConverter.addRule('formatCitationsInAnswer', turndownConfig.rules.formatCitationsInAnswer);
}
