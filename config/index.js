require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://yourdomain.com',
  database: {
    type: process.env.DATABASE_TYPE || 'postgres', // Default to postgres
    postgres: {
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      name: process.env.PG_NAME || 'url_shortener',
      password: process.env.PG_PASSWORD || '',
      port: process.env.PG_PORT || 5432,
    },
    mysql: {
      user: process.env.MYSQL_USER || 'root',
      host: process.env.MYSQL_HOST || 'localhost',
      name: process.env.MYSQL_NAME || 'url_shortener',
      password: process.env.MYSQL_PASSWORD || '',
      port: process.env.MYSQL_PORT || 3306,
    },
    sqlite: {
      file: process.env.SQLITE_FILE || './url_shortener.db',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  port: process.env.PORT || 3000,
};