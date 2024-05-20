export function extractMetadata(metadataBase) {
  return {
    domainName: metadataBase.domainName ?? window.location.hostname,
    pageTitle: getPageTitle(metadataBase.pageTitle?.selector, metadataBase.pageTitle?.treatment)
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
