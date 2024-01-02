import {Extractor} from "./Extractor";

export default class ExtractorPhind extends Extractor {
  constructor(domain) {
    super(domain);
  }

  getPageTitle() {
    const searchFirstMsg = document.querySelector('[name^="answer-"] > div > div > span');
    const agentFirstMsg = document.querySelector('[tabindex="0"]');
    return searchFirstMsg !== null && searchFirstMsg.innerHTML !== ""
      ? searchFirstMsg.innerHTML
      : agentFirstMsg
        ? agentFirstMsg.innerText.replace(/\u00A0/g, " ")
        : "";
  }
}
