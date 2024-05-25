import * as metadataFunctions from '../../../../src/scripts/content/extractor/extractPageMetadata';


describe('extractPageMetadata', () => {
  beforeAll(() => {
    // Simulate window.location
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      hostname: 'example.com',
    };

    document.title = 'Default Title';

    // Mock getPageTitle
    // TODO: Mock getPageTitle instead of depending on getPageTitle

    console.log(metadataFunctions.getPageTitle(document.title));

    jest.spyOn(metadataFunctions, 'getPageTitle').mockImplementation(() => {
      return 'Expected Page Title';
    });
    // jest.spyOn(metadataFunctions, 'getPageTitle').mockReturnValue('Expected Page Title');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should extract metadata correctly using default values', () => {
    const metadataBase = {
      domainName: 'Phind Chat',
      pageTitle: {
        selector: '[tabindex="0"]',
        treatment: {
          action: 'replace',
          params: ['/\\u00A0/', ' ']
        }
      },
      contentSelector: '[name^="answer-"]'
    };
    const result = metadataFunctions.extractPageMetadata(metadataBase);
    expect(result).toEqual({
      domainName: 'Phind Chat',
      pageTitle: 'Expected Page Title',
      contentSelector: '[name^="answer-"]'
    });
  });

  it('should use window.location.hostname if domainName is not provided', () => {
    const metadataBase = {
      pageTitle: {
        selector: '[tabindex="0"]',
        treatment: {
          action: 'replace',
          params: ['/\\u00A0/', ' ']
        }
      },
      contentSelector: '[name^="answer-"]'
    };
    const result = metadataFunctions.extractPageMetadata(metadataBase);
    expect(result.domainName).toEqual('example.com');
  });
});

describe('getPageTitle', () => {
  beforeAll(() => {
    // Simuler document.querySelector et document.title
    document.title = 'Default Title';
    global.document.querySelector = jest.fn().mockImplementation(selector => {
      if (selector === '[tabindex="0"]') return { innerHTML: 'Page Title&nbsp;', innerText: 'Page Title ' };
      return null;
    });
  });

  it('should return the document title if selector is null', () => {
    const title = metadataFunctions.getPageTitle();
    expect(title).toEqual('Default Title');
  });

  it('should return the document title if the selector matches the document title', () => {
    const title = metadataFunctions.getPageTitle(document.title);
    expect(title).toEqual('Default Title');
  });

  it('should return the modified title according to the treatment', () => {
    const title = metadataFunctions.getPageTitle('[tabindex="0"]', {
      action: 'replace',
      params: ['/\\u00A0/', ' ']
    });
    expect(title).toEqual('Page Title ');
  });
});

// import * as extractPageMetadata from '../../../../src/scripts/content/extractor/extractPageMetadata';
//
// describe('extractPageMetadata', () => {
//   it('should return metadataBase with domainName and pageTitle', () => {
//     const metadataBase = {
//       domainName: 'example.com',
//       pageTitle: {
//         selector: 'title',
//         treatment: {
//           action: 'replace',
//           params: ['example', 'test'],
//         },
//       },
//       contentSelector: '.content',
//     };
//     const expected = {
//       domainName: 'example.com',
//       pageTitle: 'test',
//       contentSelector: '.content',
//     };
//     expect(extractPageMetadata.extractPageMetadata(metadataBase)).toEqual(expected);
//   });
//
//   it('should return metadataBase with domainName and pageTitle when pageTitle is null', () => {
//     const metadataBase = {
//       domainName: 'example.com',
//       pageTitle: null,
//       contentSelector: '.content',
//     };
//     const expected = {
//       domainName: 'example.com',
//       pageTitle: 'Test Title',
//       contentSelector: '.content',
//     };
//     expect(extractPageMetadata.extractPageMetadata(metadataBase)).toEqual(expected);
//   });
//
//   it('should return metadataBase with domainName and pageTitle when pageTitle selector is null', () => {
//     const metadataBase = {
//       domainName: 'example.com',
//       pageTitle: {
//         selector: null,
//         treatment: {
//           action: 'replace',
//           params: ['example', 'test'],
//         },
//       },
//       contentSelector: '.content',
//     };
//     const expected = {
//       domainName: 'example.com',
//       pageTitle: 'Test Title',
//       contentSelector: '.content',
//     };
//     expect(extractPageMetadata.extractPageMetadata(metadataBase)).toEqual(expected);
//   });
//
//   it('should return metadataBase with domainName and pageTitle when pageTitle selector is empty', () => {
//     const metadataBase = {
//       domainName: 'example.com',
//       pageTitle: {
//         selector: '',
//         treatment: {
//           action: 'replace',
//           params: ['example', 'test'],
//         },
//       },
//       contentSelector: '.content',
//     };
//     const expected = {
//       domainName: 'example.com',
//       pageTitle: 'Test Title',
//       contentSelector: '.content',
//     };
//     expect(extractPageMetadata.extractPageMetadata(metadataBase)).toEqual(expected);
//   });
//
//   it('should return metadataBase with domainName and pageTitle when pageTitle selector is invalid', () => {
//     const metadataBase = {
//       domainName: 'example.com',
//       pageTitle: {
//         selector: '.invalid',
//         treatment: {
//           action: 'replace',
//           params: ['example', 'test'],
//         },
//       },
//       contentSelector: '.content',
//     };
//     const expected = {
//       domainName: 'example.com',
//       pageTitle: 'Test Title',
//       contentSelector: '.content',
//     };
//     expect(extractPageMetadata.extractPageMetadata(metadataBase)).toEqual(expected);
//   });
// });
//
// describe('extractPageMetadataOld', () => {
//   beforeAll(() => {
//     // Simulate window.location
//     delete global.window.location;
//     global.window = Object.create(window);
//     global.window.location = {
//       hostname: 'example.com',
//     };
//
//     // Mock getPageTitle
//     jest.spyOn(extractPageMetadata, 'getPageTitle').mockImplementation((selector, treatment) => {
//       if (selector === '[tabindex="0"]') return 'Expected Page Title';
//       return 'Default Title';
//     });
//     // jest.spyOn(extractPageMetadata, 'getPageTitle').mockReturnValue('Expected Page Title');
//     // extractPageMetadata.getPageTitle = 'Expected Page Title';
//   });
//
//   afterAll(() => {
//     jest.restoreAllMocks();
//   });
//
//   it('should extract metadata correctly using default values', () => {
//     const metadataBase = {
//       domainName: 'Phind Chat',
//       pageTitle: {
//         selector: '[tabindex="0"]',
//         treatment: {
//           action: 'replace',
//           params: ['/\\u00A0/', ' ']
//         }
//       },
//       contentSelector: '[name^="answer-"]'
//     };
//     const result = extractPageMetadata.extractPageMetadata(metadataBase);
//     expect(result).toEqual({
//       domainName: 'Phind Chat',
//       pageTitle: 'Expected Page Title',
//       contentSelector: '[name^="answer-"]'
//     });
//   });
//
//   it('should use window.location.hostname if domainName is not provided', () => {
//     const metadataBase = {
//       pageTitle: {
//         selector: '[tabindex="0"]',
//         treatment: {
//           action: 'replace',
//           params: ['/\\u00A0/', ' ']
//         }
//       },
//       contentSelector: '[name^="answer-"]'
//     };
//     const result = extractPageMetadata.extractPageMetadata(metadataBase);
//     expect(result.domainName).toEqual('example.com');
//   });
// });
//
// describe('getPageTitle', () => {
//   beforeAll(() => {
//     // Simuler document.querySelector et document.title
//     document.title = 'Default Title';
//     global.document.querySelector = jest.fn().mockImplementation(selector => {
//       if (selector === '[tabindex="0"]') return {innerHTML: 'Page Title&nbsp;', innerText: 'Page Title '};
//       return null;
//     });
//   });
//
//   it('should return the document title if selector is null', () => {
//     const title = extractPageMetadata.getPageTitle();
//     expect(title).toEqual('Default Title');
//   });
//
//   it('should return the document title if the selector matches the document title', () => {
//     const title = extractPageMetadata.getPageTitle(document.title);
//     expect(title).toEqual('Default Title');
//   });
//
//   it('should return the modified title according to the treatment', () => {
//     const title = extractPageMetadata.getPageTitle('[tabindex="0"]', {
//       action: 'replace',
//       params: ['/\\u00A0/', ' ']
//     });
//     expect(title).toEqual('Page Title ');
//   });
// });
