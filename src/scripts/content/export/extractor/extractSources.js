import { sleep } from "../../../shared/utils/jsShorteners";

export async function extractSources(contentOrSearchResults, paginationOrRes, format, isPaginated = false) {
  let res = "";
  let i = 1;

  const extractFromLinks = (links) => {
    links.forEach((link) => {
      res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
      i++;
    });
  };

  if (isPaginated) {
    for (const elt of paginationOrRes) {
      elt.click();
      await sleep(0); // Attendre que le contenu se charge (même si c'est 0!)
      const selectSources = contentOrSearchResults.querySelectorAll('a.mb-0');
      extractFromLinks(selectSources);
    }
    paginationOrRes[0] && paginationOrRes[0].click();
  } else {
    extractFromLinks(contentOrSearchResults);
  }

  return res;
}
