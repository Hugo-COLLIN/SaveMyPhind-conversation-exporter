import {sleep} from "../utils/utils";

export async function waitAppend(select, htmlTableSectionElements, mode = 'append') {
  let nester = null;
  if (typeof select === 'string') {
    nester = document.querySelector(select);
    while (nester === null) {
      // logWaitElts();
      await sleep(1000)
      nester = document.querySelector(select);
    }
  } else if (typeof select === 'object') {
    let added = false;
    let res = select.filter(elt => document.querySelector(elt.selector))
    while (res === []) {
      await sleep(1000)
      res = select.filter(selector => document.querySelector(selector))
    }
    mode = res[0].mode;
    nester = document.querySelector(res[0].selector);
  } else return false;

  if (mode === 'prepend') {
    for (let button of htmlTableSectionElements) {
      nester.prepend(button);
    }
  } else if (mode === 'appendChild') {
    for (let button of htmlTableSectionElements) {
      nester.appendChild(button);
    }
  } else {
    for (let button of htmlTableSectionElements) {
      nester.append(button);
    }
  }
  return true;
}