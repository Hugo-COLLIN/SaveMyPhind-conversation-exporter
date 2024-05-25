/**
 * Extract metadata from the given metadataBase
 * @param metadataBase
 * @returns {{pageTitle: (string|*|string|string), domainName: (string|string)}}
 */
export function extractPageMetadata(metadataBase) {
  return {
    domainName: metadataBase.domainName ?? window.location.hostname,
    pageTitle: getPageTitle(metadataBase.pageTitle?.selector, metadataBase.pageTitle?.treatment),
    contentSelector: metadataBase.contentSelector,
  };
}

/**
 * Get the page title from the document
 * @param documentSelector
 * @param titleTreatment
 * @returns {*|string|string|string}
 */
export function getPageTitle(documentSelector = null, titleTreatment = null) {
  if (!documentSelector || documentSelector === document.title)
    return document.title;

  const selectTitle = document.querySelector(documentSelector);

  if (selectTitle === null || selectTitle.innerHTML === "")
    return document.title;
  if (!titleTreatment || !titleTreatment.params)
    return selectTitle.innerText;

  let params = titleTreatment.params;
  for (const param of titleTreatment.params)
    if (param.startsWith('/') && param.endsWith('/'))
      params[params.indexOf(param)] = new RegExp(param.slice(1, -1), 'g');

  return selectTitle.innerText[titleTreatment.action](...params);
}
