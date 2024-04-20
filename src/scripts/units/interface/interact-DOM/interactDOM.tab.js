import {sleep} from "../../utils/jsShorteners.all";

/**
 * Wait for an element to appear in the DOM
 * @param select CSS selector
 * @param duration Time between each check
 * @param attempts Number of attempts
 * @returns {Promise<HTMLElement|false>} The element if it appears, false otherwise
 */
export async function waitAppears(select, duration = 100, attempts = 100) {
  // console.log(`Waiting for ${select} to appear...`)
  let i = 1;
  let nester;
  do {
    if (i > attempts) return false;
    nester = document.querySelector(select);
    // await logWaitElts();
    await sleep(duration)
    i++;
  } while (nester === null);

  return nester;
}

/**
 * Ensure adding elements to the DOM by waiting for a parent element to appear
 * @param select CSS selector
 * @param htmlTableSectionElements Array of elements to add
 * @param mode executed method (append, prepend, after, insertBefore)
 * @returns {Promise<boolean>} true if the elements have been added, false otherwise
 */
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
  return true;
}

/**
 * Execute a function when an element is added to the DOM
 * @param dialogSelector
 * @param functionToExecute
 */
export function whenDOMElementAdded(dialogSelector, functionToExecute) { // TODO: Make it an insertElement generic function
  const targetNode = document.querySelector('body'); // Change this to a stable parent element
  const observer = new MutationObserver(async (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const dialogNode = document.querySelector(dialogSelector);
        if (dialogNode && !dialogNode.hasAttribute('data-input-added')) {
          dialogNode.setAttribute('data-input-added', 'true');
          await functionToExecute();
        }
      }
    }
  });
  observer.observe(targetNode, {attributes: false, childList: true, subtree: true});
}
