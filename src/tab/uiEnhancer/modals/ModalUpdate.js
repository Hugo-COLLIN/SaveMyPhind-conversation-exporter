import {Modal} from "./Modal";
import {getUpdatesData} from "../messenger/updateNotes";
import appInfos from "../../../infos.json";

export default class ModalUpdate extends Modal {
  constructor(...params) {
    super(...params);
  }

  async appendModal() {
    await super.appendModal();

    chrome.storage.sync.set({displayModalUpdate: false}, function () {
      console.log("Last update modal will not be displayed until the next update");
    });
  }

  async createModalContent(modalBodyDiv, outerDiv, modalBackground) {
    const updates = await getUpdatesData();
    const domain = this.params[0];

    // Title
    const innerDivImage = document.createElement('span');
    innerDivImage.style.marginRight = '10px';
    const innerDivImageImg = document.createElement('img');
    innerDivImageImg.src = chrome.runtime.getURL('assets/icons/icon-48.png');
    innerDivImageImg.alt = `${appInfos.APP_SNAME} icon`;
    innerDivImageImg.width = '48';
    innerDivImageImg.height = '48';
    innerDivImage.appendChild(innerDivImageImg);

    const modalTitleDiv = document.createElement('div');
    modalTitleDiv.classList.add('mb-5', 'modal-title', 'h2');
    modalTitleDiv.innerHTML = "Hey, it's an update!";
    modalBodyDiv.appendChild(modalTitleDiv);

    modalTitleDiv.prepend(innerDivImage);

    const modalSubtitleDiv = document.createElement('div');
    modalSubtitleDiv.classList.add('mb-5', 'modal-title', 'h3');
    modalSubtitleDiv.innerHTML = `What's new in ${appInfos.APP_NAME} v${appInfos.APP_VERSION}:`;

    const innerDivLink = document.createElement('a');
    innerDivLink.target = '_blank';
    innerDivLink.classList.add('mb-0');

    const manifest = chrome.runtime.getManifest();
    let storeName;
    if (manifest.browser_specific_settings !== undefined && manifest.browser_specific_settings.gecko !== undefined) {
      innerDivLink.href = appInfos.URLS.STORES.FIREFOX + "/reviews";
      storeName = "Firefox Add-ons Store";
    } else {
      innerDivLink.href = appInfos.URLS.STORES.CHROME + "/reviews";
      storeName = "Chrome Web Store";
    }
    innerDivLink.innerHTML = `⭐ If ${appInfos.APP_NAME} helps you, please leave it a review on the ${storeName}! ⭐<br>`;


    let innerDiv4 = this.createModalTextGroup(`Enjoy!<br>Hugo <small>- ${appInfos.APP_SNAME} creator</small>`, `I'm not affiliated with the ${domain.url.slice(4)} developers, I just love this website and I wanted to make it even better.`); //I'm not affiliated with Phind, I just love this website and I wanted to make it better for me and for you. If you want to support me, you can donate at https://www.paypal.com/paypalme/${appInfos.APP_SNAME}
    // innerDiv4.classList.add('fw-bold')

    modalBodyDiv.appendChild(innerDivLink);
    modalBodyDiv.appendChild(document.createElement('br'));

    modalBodyDiv.appendChild(modalSubtitleDiv);

    updates.forEach((update) => {
      const innerDiv = this.createModalTextGroup("&#x2A20; " + update.title, update.description);
      innerDiv.classList.add('fw-bold');
      modalBodyDiv.appendChild(innerDiv);
    });
    modalBodyDiv.appendChild(document.createElement('br'));
    modalBodyDiv.appendChild(innerDiv4);

// Step 8: Create the Close button.
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('m-1', 'btn', 'btn-secondary');
    closeButton.innerHTML = domain.name === "Phind"
      ? "Let's Phind!"
      : "Let's search!";

    const reviewButton = document.createElement('a');
    reviewButton.href = appInfos.URLS.SUPPORT;
    reviewButton.target = '_blank';
    reviewButton.type = 'button';
    reviewButton.classList.add('m-1', 'btn', 'btn-primary');
    reviewButton.innerHTML = "👍 Support my work!";

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
