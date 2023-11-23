import {improvePhindUI} from "./phind/improvePhindUI";
import {dynamicCall} from "../../common/utils";


export async function uiEnhancer(domain) {
  window.addEventListener('load', async function () {
    // const domainName = domain.name;
    // // const domainNameLower = domainName.toLowerCase();
    // const path = `./improveUI`;
    // console.log(path)
    // const module = await import(path);
    // dynamicCall(module, `improve${domainName}UI`);
    if (domain.name === 'Phind')
      improvePhindUI(); // TODO: replace by a Phind, and Perplexity classes
  });
}
