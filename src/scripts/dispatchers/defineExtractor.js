export async function defineExtractor(domain) {
  let module;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`../units/processing/extractor/ExtractorPhindSearch.tab`);
      break;
    case "PhindChat":
      module = await import(`../units/processing/extractor/ExtractorPhindChat.tab`);
      break;
    case "Perplexity":
      module = await import(`../units/processing/extractor/ExtractorPerplexity.tab`);
      break;
    case "MaxAIGoogle":
      module = await import(`../units/processing/extractor/ExtractorMaxAIGoogle.tab`);
      break;
    default:
      module = await import(`../units/processing/extractor/ExtractorArbitraryPage.tab`);
  }
  return new module.default();
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
