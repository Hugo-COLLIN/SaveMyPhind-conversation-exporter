import {logWaitList} from "../useStoredData/consoleMessages";
import {sleep} from "../utils/utils";

export async function clickOnListElt(index) {
  let list = document.querySelectorAll('.table-responsive tr');
  while (list.length === 0) {
    logWaitList();
    await sleep(1000);
    list = document.querySelectorAll('.table-responsive tr');
  }
  list[index].click();
}