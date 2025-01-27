import ModalUpdate from "../types/ModalUpdate";

export async function displayInstallModals(domain: {name: string, url: string}) {
  const displayModalUpdate = await chrome.storage.sync.get('displayModalUpdate');
  // const displayModalWelcome = await chrome.storage.sync.get('displayModalWelcome');

  // Create "last update" modal if needed
  if (displayModalUpdate['displayModalUpdate']) {
    await new ModalUpdate(domain).appendModal()
    await chrome.storage.sync.set({displayModalUpdate: false});
  }

  // Create "welcome" modal if needed
  // if (displayModalWelcome['displayModalWelcome']) {
  //   await new ModalMessage('../files/modalMessages/modalTutorial.md').appendModal();
  //   await chrome.storage.sync.set({displayModalWelcome: false});
  // }
}

