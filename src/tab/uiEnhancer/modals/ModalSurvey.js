import {Modal} from "./Modal";
import appInfos from "../../../infos.json";
import modalJsonContent from "../../../assets/modalMessages/modalSurvey.json";

export default class ModalDetectClicks extends Modal {
  constructor(...params) {
    super(...params);
  }

  createModalContent(modalBodyDiv, outerDiv, modalBackground) {
    const showdown  = require('showdown'),
      converter = new showdown.Converter({
        extensions: [
          function () {
            return [
              {
                type: 'output',
                regex: /<strong>(.*?)<\/strong>/g,
                replace: '<b>$1</b>'
              }
            ];
          }
        ]
      });

    // Title
    const innerDivImage = document.createElement('span');
    innerDivImage.style.marginRight = '10px';
    const innerDivImageImg = document.createElement('img');
    innerDivImageImg.src = chrome.runtime.getURL('assets/icons/icon-48.png');
    innerDivImageImg.alt = `${appInfos.APP_SNAME} icon`;
    innerDivImageImg.width = 48;
    innerDivImageImg.height = 48;
    innerDivImage.appendChild(innerDivImageImg);

    const modalTitleDiv = document.createElement('div');
    modalTitleDiv.classList.add('mb-5', 'modal-title', 'h2');
    modalTitleDiv.innerHTML = modalJsonContent.title;
    modalBodyDiv.appendChild(modalTitleDiv);

    modalTitleDiv.prepend(innerDivImage);

    let innerDiv4 = this.createModalTextGroup(converter.makeHtml(modalJsonContent.markdownContent.replace(/\${appInfos.APP_NAME}/g, appInfos.APP_NAME)));
    innerDiv4.fontWeight = 'normal';

    modalBodyDiv.appendChild(document.createElement('br'));


    modalBodyDiv.appendChild(innerDiv4);

// Step 8: Create the Close buttons.
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('m-1', 'btn', 'btn-secondary');
    closeButton.style.fontSize = '0.9em';
    closeButton.innerHTML = modalJsonContent.buttons.no.title;

    const reviewButton = document.createElement('a');
    reviewButton.href = modalJsonContent.buttons.yes.url;
    reviewButton.target = '_blank';
    reviewButton.type = 'button';
    reviewButton.classList.add('m-1', 'btn', 'btn-primary');
    reviewButton.innerHTML = modalJsonContent.buttons.yes.title;

    const modalBtnDiv = document.createElement('div');
    modalBtnDiv.style.textAlign = 'center';
    modalBtnDiv.appendChild(closeButton);
    modalBtnDiv.appendChild(reviewButton);

    modalBodyDiv.appendChild(modalBtnDiv);

    closeButton.addEventListener('click', function () {
      outerDiv.remove();
      modalBackground.remove();
    });
  }
}
