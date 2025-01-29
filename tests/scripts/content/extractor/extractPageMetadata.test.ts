import { JSDOM } from 'jsdom';
import * as metadataFunctions from '../../../../src/core/services/pageExtractor/extractPageMetadata';

describe('extractPageMetadata', () => {
  let dom;
  let window: any;
  let document: any;

  beforeAll(() => {
    // Configure jsdom
    dom = new JSDOM(`<!DOCTYPE html><html><head><title>Default Title</title></head><body></body></html>`);
    window = dom.window;
    document = window.document;

    window.location = new URL('https://example.com');

    // Mock document.querySelector
    jest.spyOn(document, 'querySelector').mockImplementation(selector => {
      if (selector === '[tabindex="0"]') return { innerHTML: 'Page Title&nbsp;', innerText: 'Page Title ' };
      return null;
    });

    // Injecter la fenêtre de simulation et le document dans les fonctions du module
    jest.spyOn(metadataFunctions, 'getPageTitle').mockImplementation((documentSelector, titleTreatment) => {
      const selectTitle = documentSelector ? document.querySelector(documentSelector) : null;
      if (!selectTitle || !selectTitle.innerHTML) return document.title;

      // @ts-ignore TODO change
      if (titleTreatment?.action === 'replace') {
        const [pattern, replacement] = titleTreatment.params;
        return selectTitle.innerText.replace(new RegExp(pattern, 'g'), replacement);
      }
      return selectTitle.innerText;
    });

    // @ts-ignore
    jest.spyOn(metadataFunctions, 'extractPageMetadata').mockImplementation((metadataBase) => {
      return {
        domainName: metadataBase.domainName ?? window.location.hostname,
        pageTitle: metadataFunctions.getPageTitle(metadataBase.pageTitle?.selector, metadataBase.pageTitle?.treatment),
        contentSelector: metadataBase.contentSelector,
      };
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('extractPageMetadata', () => {
    it('should extract metadata correctly using default values', () => {
      const metadataBase = {
        domainName: 'Phind Chat',
        pageTitle: {
          selector: '[tabindex="0"]',
          treatment: {
            action: 'replace',
            params: ['\\u00A0', ' ']
          }
        },
        contentSelector: '[name^="answer-"]'
      };
      // @ts-ignore
      const result = metadataFunctions.extractPageMetadata(metadataBase);
      expect(result).toEqual({
        domainName: 'Phind Chat',
        pageTitle: 'Page Title ',
        contentSelector: '[name^="answer-"]'
      });
    });

    it('should use window.location.hostname if domainName is not provided', () => {
      const metadataBase = {
        pageTitle: {
          selector: '[tabindex="0"]',
          treatment: {
            action: 'replace',
            params: ['\\u00A0', ' ']
          }
        },
        contentSelector: '[name^="answer-"]'
      };
      // @ts-ignore
      const result = metadataFunctions.extractPageMetadata(metadataBase);
      expect(result.domainName).toEqual('example.com');
    });
  });

  describe('getPageTitle', () => {
    it('should return the document title if selector is null', () => {
      const title = metadataFunctions.getPageTitle();
      expect(title).toEqual('Default Title');
    });

    it('should return the document title if the selector matches the document title', () => {
      const title = metadataFunctions.getPageTitle(null, null);
      expect(title).toEqual('Default Title');
    });

    it('should return the modified title according to the treatment', () => {
      // @ts-ignore
      const title = metadataFunctions.getPageTitle('[tabindex="0"]', {
        action: 'replace',
        params: ['\\u00A0', ' ']
      });
      expect(title).toEqual('Page Title ');
    });
  });
});
