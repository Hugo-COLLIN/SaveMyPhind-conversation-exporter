import { extractArbitraryPage, extractPhindSearchPage, extractPhindAgentPage, extractPerplexityPage, extractMaxAIGooglePage } from './extractor/extractPages.js';
import { setFileHeader } from '../../../../../src/services/format/formatMarkdown.js';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

jest.mock('../../../../../src/services/format/formatMarkdown.js', () => ({
  setFileHeader: jest.fn(() => Promise.resolve('Mock header')),
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

  test('extractPhindSearchPage handles no answers', async () => {
    const format = jest.fn((html) => html);
    document.body.innerHTML = '';
    const result = await extractPhindSearchPage(format);
    expect(result).toContain('Mock header');
    expect(format).not.toHaveBeenCalled();
  });

  test('extractPhindSearchPage formats user question and AI answer', async () => {
    const format = jest.fn((html) => html);
    document.body.innerHTML = `
    <div name="answer-1">
      <div>
        <div>
          <span>User question</span>
          <h6>AI model</h6>
        </div>
      </div>
    </div>
  `;
    await extractPhindSearchPage(format);
    expect(format).toHaveBeenCalledWith('User question');
    expect(format).toHaveBeenCalledWith('AI model');
  });

  test('extractPhindSearchPage formats AI citations and sources', async () => {
    const format = jest.fn((html) => html);
    document.body.innerHTML = `
    <div name="answer-1">
      <div>
        <div>
          <span>User question</span>
          <h6>AI model</h6>
        </div>
        <div>
          <div>
            <div>AI citations</div>
          </div>
          <div>
            <div>
              <h6></h6>
              <div>
                <a href="/source1">0</a>
                <a href="/source2">0</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    await extractPhindSearchPage(format);
    expect(format).toHaveBeenCalledWith('AI citations');
    expect(format).toHaveBeenCalledWith('<a href="/source1">0</a>');
    expect(format).toHaveBeenCalledWith('<a href="/source2">0</a>');
  });

});
