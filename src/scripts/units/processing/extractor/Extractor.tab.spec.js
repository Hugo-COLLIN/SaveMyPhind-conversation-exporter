import { Extractor } from './Extractor.tab';
import { formatFilename } from "../formatter/formatText.all";

describe('Extractor', () => {
  let extractor;

  beforeEach(() => {
    extractor = new Extractor();
    global.alert = jest.fn();
  });

  test('launch should return correct data', async () => {
    extractor.extractPage = jest.fn();
    extractor.extractMetadata = jest.fn();
    extractor.getPageTitle = jest.fn();
    extractor.getPageSource = jest.fn();
    extractor.applyExtractorRules = jest.fn();

    await extractor.extractPage.mockResolvedValue('mockMarkdownContent');
    extractor.extractMetadata.mockReturnValue({title: 'mockTitle', source: 'mockSource'});
    extractor.getPageTitle.mockReturnValue('mockTitle');
    extractor.getPageSource.mockReturnValue('mockSource');
    extractor.applyExtractorRules.mockReturnValue('mockMarkdownContent');

    const result = await extractor.launch();

    expect(result.markdownContent).toBe('mockMarkdownContent');
    expect(result.title).toBe('mockTitle');
    expect(result.fileName).toBe(formatFilename('mockTitle', 'mockSource'));
  });

  test('launch should handle errors', async () => {
    extractor.extractPage = jest.fn();
    extractor.applyExtractorRules = jest.fn();

    extractor.extractPage.mockImplementation(() => {
      throw new Error('mock error');
    });
    extractor.applyExtractorRules.mockReturnValue('mockMarkdownContent');

    const result = await extractor.launch();

    expect(result).toBeNull();
  });

  test('extractMetadata should return correct metadata', () => {
    extractor.getPageTitle = jest.fn();
    extractor.getPageSource = jest.fn();

    extractor.getPageTitle.mockReturnValue('mockTitle');
    extractor.getPageSource.mockReturnValue('mockSource');

    const result = extractor.extractMetadata();

    expect(result.title).toBe('mockTitle');
    expect(result.source).toBe('mockSource');
  });

  test('extractPage should throw an error', async () => {
    await expect(extractor.extractPage()).rejects.toThrow('Not implemented');
  });

  test('getPageTitle should throw an error', () => {
    expect(() => extractor.getPageTitle()).toThrow('Not implemented');
  });

  test('getPageSource should throw an error', () => {
    expect(() => extractor.getPageSource()).toThrow('Not implemented');
  });

  test('applyExtractorRules should throw an error', () => {
    expect(() => extractor.applyExtractorRules()).toThrow('Not implemented');
  });
});
