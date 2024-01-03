/*
--- ELTS CREATION ---
 */

import appInfos from "../../../../infos.json";



export async function createSideMenuBtn(title, icon, display = '', txtSize = 'fs-5') {
  // Create table element
  const table = document.createElement('table');
  table.className = 'table darkmode-semi-light table-flush table-hover text-black border border-history-panel mb-0';

// Step 2: Create the tbody element.
  var button = document.createElement('tbody');

// Step 3: Create the tr element and set its style.
  var tr = document.createElement('tr');
  tr.style.cursor = 'pointer';

// Step 4: Create the td element.
  var td = document.createElement('td');

// Step 5: Create the first div with the class row.
  var div1 = document.createElement('div');
  div1.classList.add('row');

// Step 6: Create the col-1 fs-5 div
  var div2 = document.createElement('div');
  div2.classList.add('col-1', 'fs-5');

// Step 7: Create the fw-bold col-10 fs-5 div.
  var div3 = document.createElement('div');
  div3.classList.add('fw-bold', 'col-10', txtSize);

// Step 8: Create the i element with the class 'mx-2 fe fe-message-square'
  var iElement = document.createElement('i');
  iElement.classList.add('mx-2', 'fe', icon);

// Step 9: Set the rest of the div's innerHTML.
  div3.innerHTML += title;

// Step 10: Append the iElement to div3 before the text.
  div3.insertBefore(iElement, div3.childNodes[0]);

// Step 11: Append the div2 and div3 to div1.
  div1.appendChild(div2);
  div1.appendChild(div3);

// Step 12: Append div1 to td.
  td.appendChild(div1);

// Step 13: Append td to tr.
  tr.appendChild(td);

// Step 14: Append tr to tbody.
  button.appendChild(tr);

  table.appendChild(button);

  table.setAttribute("extension", appInfos.APP_SNAME);

  return table;
}

export async function createTopBtn(title, icon, classElt = '') {

  let buttonElement = document.createElement('button');

// Step 3: Set the type and class attributes of the button.
  buttonElement.setAttribute('type', 'button');
  buttonElement.classList.add('btn', 'btn-primary', 'btn-sm', 'mt-1');

// Step 4: Create the i element and set its class.
  var iElement = document.createElement('i');
  iElement.classList.add('mx-2', 'fe', icon);

// Step 5: Set the button's innerHTML.
  buttonElement.innerHTML = title;

  buttonElement.style.margin = '0 4px 0 0';

// Step 6: Append the iElement to the button before the text.
  buttonElement.insertBefore(iElement, buttonElement.childNodes[0]);

  if (classElt !== '') buttonElement.classList.add(classElt);

  buttonElement.setAttribute("extension", appInfos.APP_SNAME);

  return buttonElement;
}

export async function createSmallField(placeholder) {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.classList.add('form-control', 'form-control-sm', 'mb-1');
  input.setAttribute("extension", appInfos.APP_SNAME);

  return input;
}

export async function createButtonGroup(id) {
  const btnsGroup = document.createElement("div");
  btnsGroup.classList.add("button-group", "mb-2");
  btnsGroup.id = id;
  btnsGroup.setAttribute("extension", appInfos.APP_SNAME);
  btnsGroup.style.display = "inline";

  return btnsGroup;
}
