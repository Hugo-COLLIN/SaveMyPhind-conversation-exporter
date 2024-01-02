import { extractArbitraryPage, extractPhindSearchPage, extractPhindAgentPage, extractPerplexityPage, extractMaxAIGooglePage } from '../../../../src/tab/scraper/extractor/extractPages.js';
import { setFileHeader } from '../../../../src/tab/formatter/formatMarkdown.js';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

jest.mock('../../../../src/tab/formatter/formatMarkdown.js', () => ({
  setFileHeader: jest.fn(() => Promise.resolve('Mock header')),
}));


//TODO change
// Avoid error fetch is not defined
jest.mock('../../../../src/common/appInfos.js', () => ({
  fetchInfos: jest.fn(() => Promise.resolve({ data: '12345' })),
  getAppInfos: jest.fn(),
}));


describe('Page extraction functions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<p>Test content</p>';
    fetchMock.mockResponse(JSON.stringify({ data: '12345' }));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  test('extractArbitraryPage returns the expected markdown', async () => {
    const format = jest.fn((html) => html);
    const result = await extractArbitraryPage(format);
    expect(result).toContain('Test content');
    expect(setFileHeader).toHaveBeenCalledWith(document.title, window.location.hostname);
  });

  // Ajoutez des tests similaires pour les autres fonctions
  // test('extractPhindSearchPage returns the expected markdown', async () => {
  //   ...
  // });

  // test('extractPhindAgentPage returns the expected markdown', async () => {
  //   ...
  // });

  // test('extractPerplexityPage returns the expected markdown', async () => {
  //   ...
  // });

  // test('extractMaxAIGooglePage returns the expected markdown', async () => {
  //   ...
  // });
});
