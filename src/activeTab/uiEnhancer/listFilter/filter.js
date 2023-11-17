import {waitAppears, waitAppend} from "../elements/insertElements";
import {createSmallField} from "../elements/createElements";

export async function addListFilter() {
  // Create a text field for user input
  const input = await createSmallField('Search previous threads...');
  const historySelector = '[role="dialog"]>div>div>div>div>div>div'

  await waitAppears(historySelector, 100, 1000);
  await waitAppend(historySelector, [input], 'after');

  // Event listener for changes in the text field
  input.addEventListener('input', () => {
    filterList(input, historySelector + ':nth-of-type(3)>div', '>div>div');
  });
}

// Filter the list based on the user input
function filterList(input, rowsSelector, textSelector) {
  const filterText = input.value.toLowerCase();
  const rows = document.querySelectorAll(rowsSelector);

  rows.forEach(row => {
    const text = row.querySelector(rowsSelector + textSelector).textContent.toLowerCase();
    row.style.display = text.includes(filterText) ? '' : 'none';
  });
}