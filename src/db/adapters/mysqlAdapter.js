const mysql = require('mysql2/promise');

class MySQLAdapter {
  constructor(config) {
    this.pool = mysql.createPool({
      user: config.user,
      host: config.host,
      database: config.name,
      password: config.password,
      port: config.port,
      connectionLimit: 20,
    });
  }

  async connect() {
    await this.pool.query('SELECT 1'); // Test connection
    console.log('Connected to MySQL');
  }

  async createShortUrl(originalUrl, shortCode) {
    const [result] = await this.pool.query(
      'INSERT INTO url_mappings (original_url, short_code) VALUES (?, ?)',
      [originalUrl, shortCode]
    );
    return result.insertId;
  }

  async getOriginalUrl(shortCode) {
    const [rows] = await this.pool.query(
      'SELECT original_url FROM url_mappings WHERE short_code = ?',
      [shortCode]
    );
    return rows.length > 0 ? rows[0].original_url : null;
  }

  async incrementClickCount(shortCode) {
    await this.pool.query(
      'UPDATE url_mappings SET click_count = click_count + 1 WHERE short_code = ?',
      [shortCode]
    );
  }
}

module.exports = MySQLAdapter;