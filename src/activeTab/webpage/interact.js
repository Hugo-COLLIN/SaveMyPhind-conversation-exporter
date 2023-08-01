import {logWaitList} from "../storedData/consoleMessages";
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

export async function unfoldQuestions() {
  const possibleElements = document.querySelectorAll('[name^="answer-"] .col-lg-8.col-xl-7 .fe-chevron-down');
  const filteredElements = Array.from(possibleElements).filter((elem) => {
    return !elem.closest('.col-lg-8.col-xl-7').querySelector('.fixed-bottom');
  });
  const chevronDown = filteredElements[0];
  if (chevronDown !== undefined) await chevronDown.click();
  return chevronDown !== undefined;
}

export async function foldQuestions() {
  const possibleElements = document.querySelectorAll('[name^="answer-"] .col-lg-8.col-xl-7 .fe-chevron-up');
  const filteredElements = Array.from(possibleElements).filter((elem) => {
    return !elem.closest('.col-lg-8.col-xl-7').querySelector('.fixed-bottom');
  });
  const chevronUp = filteredElements[0];

  if (chevronUp !== undefined) await chevronUp.click();
  return chevronUp !== undefined;
}