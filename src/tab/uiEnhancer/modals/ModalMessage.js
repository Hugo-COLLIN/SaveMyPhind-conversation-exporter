import {Modal} from "./Modal";
import appInfos from "../../../infos.json";
import yaml from 'js-yaml';

import {replaceLocalPath, replaceVariables} from "../../exportProcessor/formatter/formatVariableText";

export default class ModalMessage extends Modal {
  constructor(...params) {
    super(...params);
  }

  async createModalContent(modalBodyDiv, outerDiv, modalBackground, mdFile) {
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

    // Charger le contenu du fichier Markdown
    const response = await fetch(chrome.runtime.getURL(mdFile));
    const markdownWithYaml = (await response.text()).replaceAll('\r\n', '\n');
    const [yamlContent, markdownContent] = markdownWithYaml.split('---\n').slice(1, 3);

    // Parser l'en-tête YAML
    const yamlHeader = yaml.load(await replaceVariables(yamlContent, appInfos));

    // Traiter le contenu markdown
    const processedMarkdownContent = replaceLocalPath(await replaceVariables(markdownContent, appInfos));
    console.log(processedMarkdownContent)

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
    modalTitleDiv.innerHTML = yamlHeader.title;
    modalBodyDiv.appendChild(modalTitleDiv);

    modalTitleDiv.prepend(innerDivImage);

    // Convertir le contenu Markdown en HTML
    let innerDiv4 = this.createModalTextGroup(converter.makeHtml(processedMarkdownContent));
    innerDiv4.fontWeight = 'normal';

    modalBodyDiv.appendChild(document.createElement('br'));
    modalBodyDiv.appendChild(innerDiv4);

    // Créer et ajouter les boutons en utilisant les données de l'en-tête YAML
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('m-1', 'btn', 'btn-secondary');
    closeButton.style.fontSize = '0.9em';
    closeButton.innerHTML = yamlHeader.buttons.no.text;

    const reviewButton = document.createElement('a');
    reviewButton.href = yamlHeader.buttons.yes.url;
    reviewButton.target = '_blank';
    reviewButton.type = 'button';
    reviewButton.classList.add('m-1', 'btn', 'btn-primary');
    reviewButton.innerHTML = yamlHeader.buttons.yes.text;

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
