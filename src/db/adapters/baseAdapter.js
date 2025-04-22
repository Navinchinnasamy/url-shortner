class BaseDatabaseAdapter {
  async connect() {
    throw new Error('connect() must be implemented');
  }

  async createShortUrl(originalUrl, shortCode) {
    throw new Error('createShortUrl() must be implemented');
  }

  async getOriginalUrl(shortCode) {
    throw new Error('getOriginalUrl() must be implemented');
  }

  async incrementClickCount(shortCode) {
    throw new Error('incrementClickCount() must be implemented');
  }
}

module.exports = BaseDatabaseAdapter;