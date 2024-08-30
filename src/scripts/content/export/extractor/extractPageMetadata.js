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
    actions: metadataBase.actions,
  };
}

/**
 * Get the page title from the document
 * @param documentSelector
 * @param titleTreatment
 * @returns {*|string|string|string}
 */
export function getPageTitle(documentSelector = null, titleTreatment = null) {
  const selectTitle = documentSelector
    ? document.querySelector(documentSelector)
    : null; // cases: when the selector is the document title or just targets nothing

  if (!selectTitle || !selectTitle.innerHTML)
    return document.title;

  if (!titleTreatment || !titleTreatment.params)
    return selectTitle.innerText;

  const params = titleTreatment.params.map(param =>
    param.startsWith('/') && param.endsWith('/')
      ? new RegExp(param.slice(1, -1), 'g')
      : param
  );

  return selectTitle.innerText[titleTreatment.action](...params);
}
