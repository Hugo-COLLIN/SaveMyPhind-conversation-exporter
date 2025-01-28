export function createWindow(url: string, type = "popup", width = 450, height = 600) {
  // @ts-ignore TODO
  chrome.windows.create({
    url: chrome.runtime.getURL(url),
    type: type,
    width: width,
    height: height
  });
}

export function setOneTimePopup(localUrl: any) {
  chrome.action.setPopup({popup: localUrl}, () => {
    chrome.action.openPopup().then(r =>
      chrome.action.setPopup({popup: ""})
    );
  });
}
