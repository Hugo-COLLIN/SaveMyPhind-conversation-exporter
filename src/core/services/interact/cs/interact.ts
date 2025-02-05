import {sleep} from "../../../utils/jsShorteners";

/* UNUSED
// TODO: Make functions more generic (not only for Phind)
import {logWaitList} from "../../consoleMessages";

export async function clickOnListElt(index: number, selector = '.table-responsive tr') {
  let list = document.querySelectorAll(selector);
  while (list.length === 0) {
    logWaitList();
    await sleep(1000);
    list = document.querySelectorAll(selector);
  }
  list[index].click();
}
*/

export async function clickElements(cssSelector : string) {
  const possibleElements = document.querySelectorAll('.chat-qa-pair'); // TODO: Make this more generic than just for Phind
  possibleElements.forEach((element) => {
    const btn = element.querySelector(cssSelector);
    sleep(2000)
    // @ts-ignore TODO
    if (btn) btn.click();
  });
}

// --- Generic functions ---
/**
 *
 * @param actionsList {Array<{selector: string, scope: string, wait: number|undefined}>} List of queryselectors to click on one after the other
 * @param content {HTMLElement} The content of the page
 * @returns {Promise<Element | null | undefined>} The last element clicked on
 */
export async function selectAndClick(actionsList: Array<{ selector?: string; scope?: string; wait?: number; }>, content: HTMLElement): Promise<Element | Document | null> {
  let element = null;
  for (const query of actionsList) {
    switch (query.scope) {
      case 'content':
        element = query.selector
          ? content.querySelector(query.selector)
          : content;
        break;
      case 'document':
        element = query.selector
          ? document.querySelector(query.selector)
          : document;
        break;
      default:
        console.warn("Unknown scope: " + query.scope + ". Defaulting to content for query: " + query.selector + ".");
        return query.selector
          ? content.querySelector(query.selector)
          : content;
    }

    //TODO: define custom delay for each domain separately in JSON configuration
    if (query.wait && typeof query.wait === 'number') {
      // @ts-ignore TODO
      await sleep(open.wait);
    }

    if (element) {
      // @ts-ignore TODO
      element.click ? await element.click() : await element.parentNode?.click();
      await sleep(10);
    }
  }
  return element;
}

export function resetPagination(pagination: NodeListOf<Element>) {
  // @ts-ignore TODO
  pagination[0] && pagination[0].click();
}
