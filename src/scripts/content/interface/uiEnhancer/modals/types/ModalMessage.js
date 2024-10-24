import {Modal} from "./Modal";
import yaml from 'js-yaml';
import {replaceLocalPath, replaceVariables} from "../../../../../../services/format/formatVariableText";
import appInfos from "../../../../../../data/infos.json";

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

    // Load the Markdown file content
    const response = await fetch(chrome.runtime.getURL(mdFile));
    const markdownWithYaml = (await response.text()).replaceAll('\r\n', '\n');
    const [yamlContent, markdownContent] = markdownWithYaml.split('---\n').slice(1, 3);

    // Parse the YAML header
    const variablesList = {...appInfos, APP_VERSION: APP_VERSION}; // include esbuild define variables
    const yamlHeader = yaml.load(await replaceVariables(yamlContent, variablesList));

    // Process Markdown content
    const processedMarkdownContent = replaceLocalPath(await replaceVariables(markdownContent, variablesList));

    // Title
    const innerDivImage = document.createElement('span');
    innerDivImage.style.marginRight = '10px';
    const innerDivImageImg = document.createElement('img');
    innerDivImageImg.src = chrome.runtime.getURL('../files/icons/icon-48.png');
    innerDivImageImg.alt = `${appInfos.APP_SNAME} icon`;
    innerDivImageImg.width = 48;
    innerDivImageImg.height = 48;
    innerDivImage.appendChild(innerDivImageImg);

    const modalTitleDiv = document.createElement('div');
    modalTitleDiv.classList.add('mb-5', 'modal-title', 'h2');
    modalTitleDiv.innerHTML = yamlHeader.title;
    modalBodyDiv.appendChild(modalTitleDiv);

    modalTitleDiv.prepend(innerDivImage);

    // Convert Markdown content to HTML
    let innerDiv4 = this.createModalTextGroup(converter.makeHtml(processedMarkdownContent));
    innerDiv4.fontWeight = 'normal';

    modalBodyDiv.appendChild(document.createElement('br'));
    modalBodyDiv.appendChild(innerDiv4);

    // ------ BUTTONS BAR ------

    const modalBtnDiv = document.createElement('div');
    modalBtnDiv.style.textAlign = 'center';

    for (const btnData of yamlHeader.buttons) {
      const button = document.createElement(btnData.url ? 'a' : 'div');
      button.type = 'button';
      button.classList.add('m-1', 'btn', btnData.style ?? 'btn-secondary');
      button.innerHTML = btnData.text ?? '';

      if (button.classList.contains('btn-secondary')){
        button.style.fontSize = '0.9em';
      }

      if (btnData.url) {
        button.href = btnData.url;
        button.target = '_blank';
      }

      button.addEventListener('click', function () {
        outerDiv.remove();
        modalBackground.remove();
      });

      modalBtnDiv.appendChild(button);
    }

    modalBodyDiv.appendChild(modalBtnDiv);
  }
}
