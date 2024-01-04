import appInfos from "../../../infos.json";
import {NotImplemented} from "../../../common/errors/NotImplemented";
import {AbstractClassInstanciation} from "../../../common/errors/AbstractClassInstanciation";

export class Modal {
  constructor(...params) {
    if (this.constructor === Modal) { // new.target === Modal
      throw new AbstractClassInstanciation();
    }
    this.params = params;
  }

  async createModal() {
    const modalBackground = this.createModalBg();

    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.classList.add('fade', 'modal', 'show');
    modal.style.display = 'block';

    const modalDialogDiv = document.createElement('div');
    modalDialogDiv.classList.add('modal-dialog');

    const modalContentDiv = document.createElement('div');
    modalContentDiv.classList.add('modal-content');

    const modalBodyDiv = document.createElement('div');
    modalBodyDiv.classList.add('bg-light', 'modal-body');

    await this.createModalContent(modalBodyDiv, modal, modalBackground, ...this.params);

    modalContentDiv.appendChild(modalBodyDiv);
    modalDialogDiv.appendChild(modalContentDiv);
    modal.appendChild(modalDialogDiv);

    return {modal, modalBackground};
  }

  createModalBg() {
    const divElement = document.createElement('div');
    divElement.classList.add('fade', 'modal-backdrop', 'show');

    return divElement;
  }

  createModalTextGroup(bigText, smallText) {
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

  async appendModal(...params) {
    let {modal, modalBackground} = await this.createModal(...params);

    const shadow = document.querySelector("#" + appInfos.APP_SNAME + "-modal-container").shadowRoot
    shadow.appendChild(modalBackground);
    shadow.appendChild(modal);
  }

  async createModalContent(modalBodyDiv, outerDiv, modalBackground, ...params) {
    throw new NotImplemented();
  }
}
