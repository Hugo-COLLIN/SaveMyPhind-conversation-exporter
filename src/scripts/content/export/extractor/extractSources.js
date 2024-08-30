import { sleep } from "../../../shared/utils/jsShorteners";

let res = "";
let i = 1;

export async function extractSources(content, format, pagination) {
  if (pagination && pagination.length > 0) {
    for (const elt of pagination) {
      elt.click();
      await sleep(0); // Wait for the content to load (even if it is 0!)
      res += selectAndExtract('a.mb-0', content, format);
    }
    pagination[0] && pagination[0].click();
  } else {
    res += selectAndExtract('.col > div > div > div:nth-last-of-type(1) > div > a', content, format);
  }

  return res;
}

function selectAndExtract(selector, content, format) {
  const selectSources = content.querySelectorAll(selector);
  return extractFromLinks(selectSources, format);
}

function extractFromLinks(links, format) {
  let res = "";
  links.forEach((link) => {
    res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
    i++;
  });
  return res;
}
