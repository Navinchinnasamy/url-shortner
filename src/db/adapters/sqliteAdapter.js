const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

class SQLiteAdapter {
  constructor(config) {
    this.dbPromise = open({
      filename: config.file,
      driver: sqlite3.Database,
    });
  }

  async connect() {
    const db = await this.dbPromise;
    await db.run('SELECT 1'); // Test connection
    console.log('Connected to SQLite');
  }

  async createShortUrl(originalUrl, shortCode) {
    const db = await this.dbPromise;
    const result = await db.run(
      'INSERT INTO url_mappings (original_url, short_code) VALUES (?, ?)',
      [originalUrl, shortCode]
    );
    return result.lastID;
  }

  async getOriginalUrl(shortCode) {
    const db = await this.dbPromise;
    const row = await db.get(
      'SELECT original_url FROM url_mappings WHERE short_code = ?',
      [shortCode]
    );
    return row ? row.original_url : null;
  }

  async incrementClickCount(shortCode) {
    const db = await this.dbPromise;
    await db.run(
      'UPDATE url_mappings SET click_count = click_count + 1 WHERE short_code = ?',
      [shortCode]
    );
  }
}

module.exports = SQLiteAdapter;
