export async function defineExtractor(domain) {
  let module;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`../../units/processing/scraper/ExtractorPhindSearch.tab`);
      break;
    case "PhindChat":
      module = await import(`../../units/processing/scraper/ExtractorPhindChat.tab`);
      break;
    case "Perplexity":
      module = await import(`../../units/processing/scraper/ExtractorPerplexity.tab`);
      break;
    case "MaxAIGoogle":
      module = await import(`../../units/processing/scraper/ExtractorMaxAIGoogle.tab`);
      break;
    default:
      module = await import(`../../units/processing/scraper/ExtractorArbitraryPage.tab`);
  }
  return new module.default();
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
