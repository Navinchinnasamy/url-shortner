const redis = require('../db/redis');
const { encode } = require('../utils/base62');

class UrlService {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async createShortUrl(originalUrl) {
    // Validate URL
    if (!this.isValidUrl(originalUrl)) {
      throw new Error('Invalid URL');
    }

    // Generate short code
    const id = Date.now(); // Temporary ID for demo; use DB-generated ID in production
    const shortCode = encode(id);

    // Insert into database
    await this.dbAdapter.createShortUrl(originalUrl, shortCode);

    // Cache the mapping
    await redis.setEx(shortCode, 24 * 60 * 60, originalUrl);

    return shortCode;
  }

  async getOriginalUrl(shortCode) {
    // Check cache
    let originalUrl = await redis.get(shortCode);
    if (originalUrl) {
      // Update click count (async)
      this.dbAdapter.incrementClickCount(shortCode);
      return originalUrl;
    }

    // Check database
    originalUrl = await this.dbAdapter.getOriginalUrl(shortCode);
    if (!originalUrl) {
      throw new Error('Short URL not found');
    }

    // Cache the result
    await redis.setEx(shortCode, 24 * 60 * 60, originalUrl);

    // Update click count
    await this.dbAdapter.incrementClickCount(shortCode);

    return originalUrl;
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = UrlService;