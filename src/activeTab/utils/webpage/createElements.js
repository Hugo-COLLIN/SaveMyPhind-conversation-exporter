/*
--- ELTS CREATION ---
 */

import {getAppInfos} from "../../../common/appInfos";
import {getUpdatesData} from "../../messenger/modalUpdate";

export async function createSideMenuBtn(title, icon, display = '', txtSize = 'fs-5') {
  const appInfos = await getAppInfos();

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
  const appInfos = await getAppInfos();

  let buttonElement = document.createElement('button');

// Step 3: Set the type and class attributes of the button.
  buttonElement.setAttribute('type', 'button');
  buttonElement.classList.add('btn', 'btn-primary', 'btn-sm');

// Step 4: Create the i element and set its class.
  var iElement = document.createElement('i');
  iElement.classList.add('mx-2', 'fe', icon);

// Step 5: Set the button's innerHTML.
  buttonElement.innerHTML = title;

  buttonElement.style.margin = '2px 4px 0 0';

// Step 6: Append the iElement to the button before the text.
  buttonElement.insertBefore(iElement, buttonElement.childNodes[0]);

  if (classElt !== '') buttonElement.classList.add(classElt);

  buttonElement.setAttribute("extension", appInfos.APP_SNAME);

  return buttonElement;
}

export async function createModalUpdate(modalBackground) {
  const appInfos = await getAppInfos();
  const updates = await getUpdatesData();

  var outerDiv = document.createElement('div');
  outerDiv.setAttribute('role', 'dialog');
  outerDiv.setAttribute('aria-modal', 'true');
  outerDiv.classList.add('fade', 'modal', 'show');
  outerDiv.style.display = 'block';

// Step 3: Create the modal-dialog div element.
  var modalDialogDiv = document.createElement('div');
  modalDialogDiv.classList.add('modal-dialog');

// Step 4: Create the modal-content div element.
  var modalContentDiv = document.createElement('div');
  modalContentDiv.classList.add('modal-content');

// Step 5: Create the modal-body div element.
  var modalBodyDiv = document.createElement('div');
  modalBodyDiv.classList.add('bg-light', 'modal-body');

  // Title
  var innerDivImage = document.createElement('span');
  innerDivImage.style.marginRight = '10px';
  var innerDivImageImg = document.createElement('img');
  innerDivImageImg.src = chrome.runtime.getURL('assets/icons/icon-48.png');
  innerDivImageImg.alt = `${appInfos.APP_SNAME} icon`;
  innerDivImageImg.width = '48';
  innerDivImageImg.height = '48';
  innerDivImage.appendChild(innerDivImageImg);

  var modalTitleDiv = document.createElement('div');
  modalTitleDiv.classList.add('mb-5', 'modal-title', 'h2');
  modalTitleDiv.innerHTML = "Hey, it's an update!";
  modalBodyDiv.appendChild(modalTitleDiv);

  modalTitleDiv.prepend(innerDivImage);

  var modalSubtitleDiv = document.createElement('div');
  modalSubtitleDiv.classList.add('mb-5', 'modal-title', 'h3');
  modalSubtitleDiv.innerHTML = `What's new in ${appInfos.APP_NAME} v${appInfos.APP_VERSION}:`;

  var innerDivLink = document.createElement('a');
  innerDivLink.target = '_blank';
  innerDivLink.classList.add('mb-0');

  const manifest = chrome.runtime.getManifest();
  let storeName = "Chrome Web Store";
  if (manifest.browser_specific_settings !== undefined && manifest.browser_specific_settings.gecko !== undefined) {
    innerDivLink.href = appInfos.APP_FIREFOX_STORE_URL + "/reviews";
    storeName = "Firefox Add-ons Store";
  }
  else
  {
    innerDivLink.href = appInfos.APP_WEBSTORE_URL + "/reviews";
    storeName = "Chrome Web Store";
  }
  innerDivLink.innerHTML = `⭐ If ${appInfos.APP_NAME} helps you, please leave it a review on the ${storeName}! ⭐<br>`;


  let innerDiv4 = createModalTextGroup(`Enjoy!<br>Hugo <small>- ${appInfos.APP_SNAME} creator</small>`, "I'm not affiliated with the Phind.com developers, I just love this website and I wanted to make it even better."); //I'm not affiliated with Phind, I just love this website and I wanted to make it better for me and for you. If you want to support me, you can donate at https://www.paypal.com/paypalme/${appInfos.APP_SNAME}


  modalBodyDiv.appendChild(innerDivLink);
  modalBodyDiv.appendChild(document.createElement('br'));

  modalBodyDiv.appendChild(modalSubtitleDiv);

  updates.forEach((update) => {
    const innerDiv = createModalTextGroup(update.title, update.description);
    modalBodyDiv.appendChild(innerDiv);
  });
  modalBodyDiv.appendChild(document.createElement('br'));
  modalBodyDiv.appendChild(innerDiv4);

// Step 8: Create the Close button.
  var closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('m-1', 'btn', 'btn-primary');
  closeButton.innerHTML = "Let's Phind!";

// Step 9: Append the inner divs and the Close button to the modal-content div.
  modalContentDiv.appendChild(modalBodyDiv);
  modalContentDiv.appendChild(closeButton);

// Step 10: Append the modal-dialog div to the outer div.
  modalDialogDiv.appendChild(modalContentDiv);

// Step 11: Append the outer div to the body.
  outerDiv.appendChild(modalDialogDiv);

  closeButton.addEventListener('click', function () {
    outerDiv.remove();
    modalBackground.remove();
  });

  outerDiv.setAttribute("extension", appInfos.APP_SNAME);

  return outerDiv;
}

function createModalTextGroup(bigText, smallText) {
  let innerDiv = document.createElement('div');
  innerDiv.classList.add('pb-2');
  innerDiv.style.opacity = '1';

  let p2 = document.createElement('p');
  p2.classList.add('mb-0', 'fs-4', 'fw-bold');
  p2.innerHTML = bigText;

  let desc2 = document.createElement('p');
  desc2.classList.add('mb-0', 'fs-5');
  desc2.innerHTML = smallText;

  innerDiv.appendChild(p2);
  innerDiv.appendChild(desc2);

  return innerDiv;
}

export function createModalBg() {
  var divElement = document.createElement('div');
  divElement.classList.add('fade', 'modal-backdrop', 'show');

  return divElement;
}

export async function createSmallField(placeholder) {
  const appInfos = await getAppInfos();

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.classList.add('form-control', 'form-control-sm', 'mb-1');
  input.setAttribute("extension", appInfos.APP_SNAME);

  return input;
}

export async function createButtonGroup(id) {
  const appInfos = await getAppInfos();

  const btnsGroup = document.createElement("div");
  btnsGroup.classList.add("button-group", "mb-2");
  btnsGroup.id = id;
  btnsGroup.setAttribute("extension", appInfos.APP_SNAME);

  return btnsGroup;
}