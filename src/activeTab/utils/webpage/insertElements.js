import {sleep} from "../../../common/utils";
import {logWaitElts} from "../consoleMessages";

export async function waitAppend(select, htmlTableSectionElements, mode = 'append') {
  let nester = null;
  if (typeof select === 'string') {
    nester = document.querySelector(select);
    while (nester === null) {
      await logWaitElts();
      await sleep(1000)
      nester = document.querySelector(select);
    }
  } else if (typeof select === 'object') {
    let added = false;
    let res = select.filter(elt => document.querySelector(elt.selector))
    while (Array.isArray(res) && res.length === 0) {
      await sleep(1000)
      res = select.filter(selector => document.querySelector(selector))
    }
    mode = res[0].mode;
    nester = document.querySelector(res[0].selector);
  } else return false;

  if (mode === 'insertBefore') {
    for (let button of htmlTableSectionElements) {
      nester.parentNode.insertBefore(button, nester);
    }
    return true;
  }
  for (let button of htmlTableSectionElements) {
    nester[mode](button);
  }
  // if (mode === 'prepend') {
  //   for (let button of htmlTableSectionElements) {
  //     nester.prepend(button);
  //   }
  // } else if (mode === 'appendChild') {
  //   for (let button of htmlTableSectionElements) {
  //     nester.appendChild(button);
  //   }
  // } else if (mode === 'insertBefore') {
  //
  // } else {
  //   for (let button of htmlTableSectionElements) {
  //     nester.append(button);
  //   }
  // }
  return true;
}