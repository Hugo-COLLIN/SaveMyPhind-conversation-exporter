export async function defineExtractor(domain) {
  let module;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`./units/ExtractorPhindSearch`);
      break;
    case "PhindChat":
      module = await import(`./units/ExtractorPhindChat`);
      break;
    case "Perplexity":
      module = await import(`./units/ExtractorPerplexity`);
      break;
    case "MaxAIGoogle":
      module = await import(`./units/ExtractorMaxAIGoogle`);
      break;
    default:
      module = await import(`./units/ExtractorArbitraryPage`);
  }
  return new module.default();
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
