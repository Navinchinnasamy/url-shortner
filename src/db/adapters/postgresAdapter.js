const { Pool } = require('pg');

class PostgresAdapter {
  constructor(config) {
    this.pool = new Pool({
      user: config.user,
      host: config.host,
      database: config.name,
      password: config.password,
      port: config.port,
      max: 20, // Connection pool size
    });
  }

  async connect() {
    await this.pool.query('SELECT 1'); // Test connection
    console.log('Connected to PostgreSQL');
  }

  async createShortUrl(originalUrl, shortCode) {
    const result = await this.pool.query(
      'INSERT INTO url_mappings (original_url, short_code) VALUES ($1, $2) RETURNING id',
      [originalUrl, shortCode]
    );
    return result.rows[0].id;
  }

  async getOriginalUrl(shortCode) {
    const result = await this.pool.query(
      'SELECT original_url FROM url_mappings WHERE short_code = $1',
      [shortCode]
    );
    return result.rows.length > 0 ? result.rows[0].original_url : null;
  }

  async incrementClickCount(shortCode) {
    await this.pool.query(
      'UPDATE url_mappings SET click_count = click_count + 1 WHERE short_code = $1',
      [shortCode]
    );
  }
}

module.exports = PostgresAdapter;