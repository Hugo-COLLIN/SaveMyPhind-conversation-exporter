import appInfos from "../../../infos.json";

export async function appendModalContainer() {
  const host = document.createElement('div');
  host.id = appInfos.APP_SNAME + "-modal-container";
  document.body.appendChild(host);

  // Attach a Shadow DOM to the host element
  const shadow = host.attachShadow({mode: 'open'});

  // Create a style element to reset all inheritable properties
  const style = document.createElement('style');
  style.textContent = ':host { all: initial; } p{line-height: 1.7em;} a{font-size: 1.1em;}';
  shadow.appendChild(style);

  // Add styles to the shadow dom
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('assets/styles/phind.bundle.css')
  shadow.appendChild(link);

  host.setAttribute("extension", appInfos.APP_SNAME);

}
