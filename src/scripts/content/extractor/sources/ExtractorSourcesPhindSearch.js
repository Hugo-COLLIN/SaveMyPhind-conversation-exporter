import ExtractorSources from "./ExtractorSources";
import {sleep} from "../../../shared/utils/jsShorteners";

export default class ExtractorSourcesPhindSearch extends ExtractorSources {
  async extractSources(content, format) {
    let res = "";
    let i = 1;
    for (const elt of content) {
      elt.click();
      await sleep(1);
      const selectSources = document.querySelectorAll('a.mb-0');
      selectSources.forEach((sourceElt) => {
        res += "\n- " + format(sourceElt.outerHTML).replace("[", `[(${i}) `);
        i++;
      });
    }
    content[0] && content[0].click();
    return res;
  }
}
