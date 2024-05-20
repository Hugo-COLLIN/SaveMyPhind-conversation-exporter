export function extractMetadata(domainName, titleSelector, titleTreatment = null) {
  return {
    domainName: domainName,
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
