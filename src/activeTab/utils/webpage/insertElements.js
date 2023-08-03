import {sleep} from "../../../common/utils";
import {logWaitElts} from "../consoleMessages";

export async function waitAppears(select, duration = 100, attempts = 100) {
  let i = 1;
  let nester;
  do {
    if (i > attempts) return false;
    nester = document.querySelector(select);
    await logWaitElts();
    await sleep(duration)
    i++;
  } while (nester === null);

  return nester;
}

export async function waitAppend(select, htmlTableSectionElements, mode = 'append') {
  let nester = null;
  if (typeof select === 'string') {
    nester = await waitAppears(select);
    if (!nester) return false;
  } else if (typeof select === 'object') {
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