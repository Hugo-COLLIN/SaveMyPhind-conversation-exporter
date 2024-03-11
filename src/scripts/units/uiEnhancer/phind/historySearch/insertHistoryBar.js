import {createSmallField} from "../genericElements/createElements";
import {waitAppears, waitAppend} from "../../../interactDOM/interactDOM";
import {filterList} from "../../../filterList/filter";

export async function addListFilter() {
  const historySelector = '[role="dialog"]>div>div>div>div>div>div'
  const existingInput = document.querySelector(historySelector + ' input');
  if (existingInput) {
    existingInput.remove();
  }

  // Create a text field for user input
  const input = await createSmallField('Search previous threads...');

  await waitAppears(historySelector, 100, 1000);
  await waitAppend(historySelector, [input], 'after');

  // Event listener for changes in the text field
  input.addEventListener('input', () => {
    filterList(input, historySelector + ':nth-of-type(3)>div', '>div>div');
  });
}
