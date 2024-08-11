export function setPopup(info) {
  if (info.menuItemId === "openOptions") {
    chrome.windows.create({
      url: chrome.runtime.getURL("pages/options.html"),
      type: "popup",
      width: 450,
      height: 600
    });
  }
  // else if (info.menuItemId === "openIconPopup") {
  //   chrome.action.setPopup({popup: "pages/popup.html"}, () => {
  //     chrome.action.openPopup().then(r =>
  //       chrome.action.setPopup({popup: ""})
  //     );
  //   });
  // }
}
