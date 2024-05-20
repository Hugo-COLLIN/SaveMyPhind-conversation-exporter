export function extractMetadata(name, titleSelector, titleTreatment = null) {
  return {
    name: name,
    title: getPageTitle(titleSelector)
  };
}

export function getPageTitle(documentSelector) {
  console.log(documentSelector);
  const selectTitle = document.querySelector(documentSelector);
  return selectTitle !== null && selectTitle.innerHTML !== ""
    ? selectTitle.innerText
    : "";
}
