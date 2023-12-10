import {getAppInfos} from "../../../../common/appInfos";
import {getUpdatesData} from "../../messenger/updateNotes";

export async function createModal(modalContentCreator) {
  const appInfos = await getAppInfos();

  const modalBackground = createModalBg();

  const host = document.createElement('div');
  document.body.appendChild(host);

  // Attacher un Shadow DOM à l'élément hôte
  const shadow = host.attachShadow({mode: 'open'});

  // Créer le modal comme avant
  const outerDiv = document.createElement('div');
  outerDiv.setAttribute('role', 'dialog');
  outerDiv.setAttribute('aria-modal', 'true');
  outerDiv.classList.add('fade', 'modal', 'show');
  outerDiv.style.display = 'block';

// Step 3: Create the modal-dialog div element.
  const modalDialogDiv = document.createElement('div');
  modalDialogDiv.classList.add('modal-dialog');

// Step 4: Create the modal-content div element.
  const modalContentDiv = document.createElement('div');
  modalContentDiv.classList.add('modal-content');

// Step 5: Create the modal-body div element.
  const modalBodyDiv = document.createElement('div');
  modalBodyDiv.classList.add('bg-light', 'modal-body');

  await modalContentCreator(modalBodyDiv, outerDiv, modalBackground);

// Step 9: Append the inner divs and the Close button to the modal-content div.
  modalContentDiv.appendChild(modalBodyDiv);

// Step 10: Append the modal-dialog div to the outer div.
  modalDialogDiv.appendChild(modalContentDiv);

// Step 11: Append the outer div to the body.
  outerDiv.appendChild(modalDialogDiv);


  // Ajouter le modalbg et le modal au Shadow DOM
  shadow.appendChild(modalBackground);
  shadow.appendChild(outerDiv);

  // // Ajouter les styles de Bootstrap au Shadow DOM
  // const link = document.createElement('link');
  // link.rel = 'stylesheet';
  // link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
  // shadow.appendChild(link);

  var style = document.createElement('style');
  style.textContent = `
  .modal {
     position: fixed;
     top: 0;
     left: 0;
     z-index: 1050;
     display: none;
     width: 100%;
     height: 100%;
     overflow: hidden;
     outline: 0;
   }

   .modal-dialog {
     position: relative;
     margin: auto;
     padding: 0;
     max-width: 900px;
     width: 100%;
   }

   .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #f8f9fa; /* couleur de fond modifiée */
    background-clip: padding-box;
    border: 1px solid #dee2e6; /* couleur de bordure modifiée */
    border-radius: 15px; /* coins arrondis */
    box-shadow: 0 5px 15px rgba(0,0,0,0.5); /* ombre ajoutée */
    outline: 0;
  }


   .modal-header, .modal-footer {
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 1rem;
     border-bottom: 1px solid #dee2e6;
     border-top-left-radius: calc(.3rem - 1px);
     border-top-right-radius: calc(.3rem - 1px);
   }

   .modal-title {
     margin-bottom: 0;
     line-height: 1.5;
   }

   .modal-body {
     position: relative;
     flex: 1 1 auto;
     padding: 1rem;
   }

   .modal-footer {
     display: flex;
     align-items: center;
     justify-content: flex-end;
     padding: 1rem;
     border-top: 1px solid #dee2e6;
     border-bottom-right-radius: calc(.3rem - 1px);
     border-bottom-left-radius: calc(.3rem - 1px);
   }

   .modal-backdrop {
     position: fixed;
     top: 0;
     left: 0;
     z-index: 1040;
     width: 100vw;
     height: 100vh;
     background-color: rgba(0, 0, 0, 0.5);
     
   }

   .fade {
     transition: opacity .15s linear;
   }

   .fade.show {
     opacity: 1;
   }

   .modal.show {
     display: flex;
     align-items: center;
     justify-content: center;
   }
  
   .modal-title {
      color: #333;
      font-size: 24px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      margin-bottom: 0;
      line-height: 1.5;
    }
    
    .modal-body {
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
      background-color: #f8f9fa;
      line-height: 1.6;
    }
    
    .btn {
      display: inline-block;
      font-weight: 400;
      color: #212529;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
      background-color: #007bff;
      border: 1px solid transparent;
      padding: .375rem .75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: .25rem;
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    
    .btn:hover {
      color: #212529;
      background-color: #0069d9;
      border-color: #0062cc;
    }
    
    .btn-secondary {
      color: #fff;
      background-color: #6c757d;
      border-color: #6c757d;
    }
    
    .btn-secondary:hover {
      color: #fff;
      background-color: #5a6268;
      border-color: #545b62;
    }
    
    .btn-primary {
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;
    }
    
    .btn-primary:hover {
      color: #fff;
      background-color: #0069d9;
      border-color: #0062cc;
    }
    
    .mb-5 {
      margin-bottom: 3rem!important;
    }
    
    .h2 {
      font-size: 2rem;
    }
    
    .h3 {
      font-size: 1.75rem;
    }
    
    .m-1 {
      margin: .25rem!important;
    }
    
    .pb-2 {
      padding-bottom: .5rem!important;
    }
    
    .fs-4 {
      font-size: 1.5rem!important;
    }
    
    .fw-bold {
      font-weight: 700!important;
    }
    
    .fs-5 {
      font-size: 1.25rem!important;
    }
    
    .fade {
      opacity: 0;
      transition: opacity .15s linear;
    }
    
    .fade.show {
      opacity: 1;
    }

 `;
  shadow.appendChild(style);


  host.setAttribute("extension", appInfos.APP_SNAME);

  return host;
}

export async function modalUpdateContent(modalBodyDiv, outerDiv, modalBackground) {
  const appInfos = await getAppInfos();
  const updates = await getUpdatesData();

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
  } else {
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
  closeButton.classList.add('m-1', 'btn', 'btn-secondary');
  closeButton.innerHTML = "Let's Phind!";

  var reviewButton = document.createElement('a');
  reviewButton.href = appInfos.APP_SUPPORT_URL;
  reviewButton.target = '_blank';
  reviewButton.type = 'button';
  reviewButton.classList.add('m-1', 'btn', 'btn-primary');
  reviewButton.innerHTML = "👍 Support my work!";

  var modalBtnDiv = document.createElement('div');
  modalBtnDiv.style.textAlign = 'center';
  modalBtnDiv.appendChild(closeButton);
  modalBtnDiv.appendChild(reviewButton);

  modalBodyDiv.appendChild(modalBtnDiv);

  closeButton.addEventListener('click', function () {
    outerDiv.remove();
    modalBackground.remove();
  });
}

export async function modalClicksContent(modalBodyDiv, outerDiv, modalBackground) {
  const appInfos = await getAppInfos();

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
  modalTitleDiv.innerHTML = "Many times you clicked on the this icon!";
  modalBodyDiv.appendChild(modalTitleDiv);

  modalTitleDiv.prepend(innerDivImage);

  // let innerDiv4 = createModalTextGroup(`Glad ${appInfos.APP_NAME} is useful for you! <br/><br/> Please consider support the project by donating:`); //I'm not affiliated with Phind, I just love this website and I wanted to make it better for me and for you. If you want to support me, you can donate at https://www.paypal.com/paypalme/${appInfos.APP_SNAME}

  let innerDiv4 = createModalTextGroup(`Hi, I'm Hugo COLLIN, an independent developer who created ${appInfos.APP_NAME} to help you. I love working on this project and I'd like to continue improving it for you. <br/><br/> However, being an independent developer, I rely on the support of users like you. If you find this extension useful, please consider supporting the project by making a donation. Every little bit helps and is greatly appreciated. Thank you for your support!<br/><br/>`);
  innerDiv4.fontWeight = 'normal';

  modalBodyDiv.appendChild(document.createElement('br'));


  modalBodyDiv.appendChild(innerDiv4);

// Step 8: Create the Close buttons.
  const small = document.createElement('small');


  var closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('m-1', 'btn', 'btn-secondary');
  closeButton.style.fontSize = '0.8em';
  closeButton.innerHTML = "Later...";

  var reviewButton = document.createElement('a');
  reviewButton.href = appInfos.APP_SUPPORT_URL;
  reviewButton.target = '_blank';
  reviewButton.type = 'button';
  reviewButton.classList.add('m-1', 'btn', 'btn-primary');
  reviewButton.innerHTML = "👍 Sure! Support the project!";

  var modalBtnDiv = document.createElement('div');
  modalBtnDiv.style.textAlign = 'center';
  modalBtnDiv.appendChild(closeButton);
  modalBtnDiv.appendChild(reviewButton);

  modalBodyDiv.appendChild(modalBtnDiv);

  closeButton.addEventListener('click', function () {
    outerDiv.remove();
    modalBackground.remove();
  });
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
  if (smallText !== undefined)
    innerDiv.appendChild(desc2);

  return innerDiv;
}

export function createModalBg() {
  var divElement = document.createElement('div');
  divElement.classList.add('fade', 'modal-backdrop', 'show');

  return divElement;
}