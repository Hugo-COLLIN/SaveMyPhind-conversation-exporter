export async function defineExtractor(domain) {
  let module;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`./types/ExtractorPhindSearch`);
      break;
    case "PhindChat":
      module = await import(`./types/ExtractorPhindChat`);
      break;
    case "Perplexity":
      module = await import(`./types/ExtractorPerplexity`);
      break;
    case "MaxAIGoogle":
      module = await import(`./types/ExtractorMaxAIGoogle`);
      break;
    default:
      module = await import(`./types/ExtractorArbitraryPage`);
  }
  const moduleDefault = new module.default();
  return {default: moduleDefault, metadata: module.metadata}
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
