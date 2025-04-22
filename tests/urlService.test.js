const UrlService = require('../src/services/urlService');

describe('URL Service', () => {
  const mockDbAdapter = {
    createShortUrl: jest.fn().mockResolvedValue(1),
    getOriginalUrl: jest.fn().mockResolvedValue('https://example.com'),
    incrementClickCount: jest.fn().mockResolvedValue(),
  };

  const urlService = new UrlService(mockDbAdapter);

  test('should create a short URL', async () => {
    const url = 'https://example.com';
    const shortCode = await urlService.createShortUrl(url);
    expect(shortCode).toBeDefined();
    expect(typeof shortCode).toBe('string');
    expect(mockDbAdapter.createShortUrl).toHaveBeenCalled();
  });

  test('should retrieve original URL', async () => {
    const shortCode = 'abc123';
    const originalUrl = await urlService.getOriginalUrl(shortCode);
    expect(originalUrl).toBe('https://example.com');
    expect(mockDbAdapter.getOriginalUrl).toHaveBeenCalledWith(shortCode);
  });
});