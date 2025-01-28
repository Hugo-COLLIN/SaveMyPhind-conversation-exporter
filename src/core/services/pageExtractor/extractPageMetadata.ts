/**
 * Extract metadata from the given metadataBase
 * @param metadataBase
 * @returns {{pageTitle: (string|*|string|string), domainName: (string|string)}}
 */
export function extractPageMetadata(metadataBase: {
  domainName: any;
  pageTitle: { selector: null | undefined; treatment: null | undefined; };
  contentSelector: any;
  actions: any;
  sourcesExtraction: any;
  extractor: any;
}): {
  pageTitle: string;
  domainName: string;
  contentSelector: any;
  actions: any;
  sourcesExtraction: any;
  extractor: any;
} {
  return {
    ...metadataBase,
    domainName: metadataBase.domainName ?? window.location.hostname,
    pageTitle: getPageTitle(metadataBase.pageTitle?.selector, metadataBase.pageTitle?.treatment),
  };
}

/**
 * Get the page title from the document
 * @param documentSelector
 * @param titleTreatment
 * @returns {*|string|string|string}
 */
export function getPageTitle(documentSelector = null, titleTreatment: { action: number; params: any[]; } | null = null): any | string | string | string {
  const selectTitle: HTMLElement | null = documentSelector
    ? document.querySelector(documentSelector) as unknown as HTMLElement
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

  // @ts-ignore TODO
  return selectTitle.innerText[titleTreatment.action](...params);
}
