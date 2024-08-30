import { sleep } from "../../../shared/utils/jsShorteners";

export async function extractSources(content, paginationOrRes, format, isPaginated = false) {
  let res = "";
  let i = 1;

  const extractFromLinks = (links) => {
    links.forEach((link) => {
      res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
      i++;
    });
  };

  function selectAndExtract(selector) {
    const selectSources = content.querySelectorAll(selector)
    extractFromLinks(selectSources);
  }

  if (isPaginated) {
    for (const elt of paginationOrRes) {
      elt.click();
      await sleep(0); // Wait for the content to load (even if it is 0!)
      selectAndExtract('a.mb-0')
    }
    paginationOrRes[0] && paginationOrRes[0].click();
  } else {
    selectAndExtract('.col > div > div > div:nth-last-of-type(1) > div > a');
  }

  return res;
}
