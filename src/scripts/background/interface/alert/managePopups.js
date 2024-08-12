export function createWindow(url, type = "popup", width = 450, height = 600) {
  chrome.windows.create({
    url: chrome.runtime.getURL(url),
    type: type,
    width: width,
    height: height
  });
}

export function setOneTimePopup(localUrl) {
  chrome.action.setPopup({popup: localUrl}, () => {
    chrome.action.openPopup().then(r =>
      chrome.action.setPopup({popup: ""})
    );
  });
}
