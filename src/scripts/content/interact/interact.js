// TODO: Make functions more generic (not only for Phind)

import {logWaitList} from "../../shared/utils/consoleMessages";
import {sleep} from "../../shared/utils/jsShorteners";

export async function clickOnListElt(index, selector = '.table-responsive tr') {
  let list = document.querySelectorAll(selector);
  while (list.length === 0) {
    logWaitList();
    await sleep(1000);
    list = document.querySelectorAll(selector);
  }
  list[index].click();
}

export async function clickElements(cssSelector = '.fe-chevron-down') {
  const possibleElements = document.querySelectorAll('[name^="answer-"]');
  possibleElements.forEach((element) => {
    const btn = element.querySelector(cssSelector);
    if (btn) btn.click();
  });
}
