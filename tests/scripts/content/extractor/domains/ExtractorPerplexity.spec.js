// Test pages
// https://www.perplexity.ai/search/lorem-ipsum-dolor-g7PtZOxcTjuhYIMVTTYe.A
// https://www.perplexity.ai/search/lorem-ipsum-dolor-2mBxUUVERqaFf8Q.pyYeYQ

import ExtractorPerplexity from '../../../../../src/scripts/content/extractor/domains/Perplexity';
import { formatLineBreaks } from "../../../../../src/services/format/formatText";
import { formatLink, initTurndown, setFileHeader, turndownConverter } from "../../../../../src/services/format/formatMarkdown";
import { sleep } from "../../../../../src/utils/jsShorteners";

describe('ExtractorPerplexity', () => {
  let extractorPerplexity, turndown;

  beforeEach(() => {
    extractorPerplexity = new ExtractorPerplexity('mockDomain');
    global.alert = jest.fn();
    turndown = jest.fn();
  });

  test('extractPage should return correct markdown', async () => {
    extractorPerplexity.getPageTitle = jest.fn();
    extractorPerplexity.extractSources = jest.fn();

    extractorPerplexity.getPageTitle.mockReturnValue('mockTitle');
    extractorPerplexity.extractSources.mockResolvedValue('mockSources');

    const result = await extractorPerplexity.extractPage();

    expect(result).toContain('mockTitle');
    expect(result).toContain('mockSources');
  });

  test('getPageTitle should return correct title', () => {
    document.title = 'mockTitle';

    const result = extractorPerplexity.getPageTitle();

    expect(result).toBe('mockTitle');
  });

  test('getPageSource should return correct source', () => {
    const result = extractorPerplexity.getPageSource();

    expect(result).toBe('Perplexity.ai');
  });

  test('extractSources should return correct sources', async () => {
    const mockContent = {
      querySelectorAll: jest.fn().mockReturnValue([
        { click: jest.fn(), querySelector: jest.fn().mockReturnValue({ innerText: 'View Sources' }) }
      ])
    };
    document.querySelector = jest.fn().mockReturnValue({ click: jest.fn() });

    const result = await extractorPerplexity.extractSources(mockContent, jest.fn());

    expect(result).not.toBeNull();
  });

  test('applyExtractorRules should not throw an error', () => {
    expect(() => extractorPerplexity.applyExtractorRules()).not.toThrow();
  });
});
