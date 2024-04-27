import {domainChecker} from "../../../process/scraper/steps/checkDomain.tab";


export async function domainLoadChecker() {
  const domains = {
    "Phind": "www.phind.com",
    "Perplexity": "www.perplexity.ai",
    "MaxAIGoogle": "www.google.com",
  };

  return domainChecker(domains);
}


function hasSubpages(urlString) {
  const regex = /^(https?|ftp|ssh|mailto):\/\/[a-z0-9:%_+.,#?!@&=-]+\/?$/;
  return !regex.test(urlString);
}
