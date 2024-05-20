export function extractMetadata(name, titleSelector, titleTreatment = null) {
  return {
    name: name,
    title: getPageTitle(titleSelector)
  };
}

export function getPageTitle(documentSelector = null, titleTreatment = null) {
  if (!documentSelector || documentSelector === document.title)
    return document.title;

  const selectTitle = document.querySelector(documentSelector);
  return selectTitle !== null && selectTitle.innerHTML !== ""
    ? titleTreatment
      ? selectTitle.innerText[titleTreatment.action](...titleTreatment.params)
      : selectTitle.innerText
    : "";
}
