import {Modal} from "./Modal";
import appInfos from "../../../infos.json";

export default class ModalDetectClicks extends Modal {
  constructor(...params) {
    super(...params);
  }

  createModalContent(modalBodyDiv, outerDiv, modalBackground) {
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
    modalTitleDiv.innerHTML = "😲 Many times you clicked on the this icon!";
    modalBodyDiv.appendChild(modalTitleDiv);

    modalTitleDiv.prepend(innerDivImage);

    // let innerDiv4 = createModalTextGroup(`Glad ${appInfos.APP_NAME} is useful for you! <br/><br/> Please consider support the project by donating:`); //I'm not affiliated with Phind, I just love this website and I wanted to make it better for me and for you. If you want to support me, you can donate at https://www.paypal.com/paypalme/${appInfos.APP_SNAME}

    let innerDiv4 = this.createModalTextGroup(`👋 Hi, I'm Hugo, an independent software developer who <b>created ${appInfos.APP_NAME} to help you</b>. I love working on this project and I'd like to continue improving it for you. <br/><br/> 💖 However, as an independent developer, <b>I rely on the support of users like you</b>. If you find this extension useful, <b>please consider supporting the project by making a donation.</b> Every little bit helps and is greatly appreciated. Thank you for your support!<br/><br/>`);
    innerDiv4.fontWeight = 'normal';

    modalBodyDiv.appendChild(document.createElement('br'));


    modalBodyDiv.appendChild(innerDiv4);

// Step 8: Create the Close buttons.
    const small = document.createElement('small');


    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('m-1', 'btn', 'btn-secondary');
    closeButton.style.fontSize = '0.9em';
    closeButton.innerHTML = "I let my chance pass...";

    const reviewButton = document.createElement('a');
    reviewButton.href = appInfos.APP_SUPPORT_URL;
    reviewButton.target = '_blank';
    reviewButton.type = 'button';
    reviewButton.classList.add('m-1', 'btn', 'btn-primary');
    reviewButton.innerHTML = "👍 Sure! I want to support!";

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
