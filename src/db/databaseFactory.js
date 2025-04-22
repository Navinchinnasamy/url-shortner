const PostgresAdapter = require('./adapters/postgresAdapter');
const MySQLAdapter = require('./adapters/mysqlAdapter');
const SQLiteAdapter = require('./adapters/sqliteAdapter');

function createDatabaseAdapter(config) {
  const { type, postgres, mysql, sqlite } = config.database;

  switch (type.toLowerCase()) {
    case 'postgres':
      return new PostgresAdapter(postgres);
    case 'mysql':
      return new MySQLAdapter(mysql);
    case 'sqlite':
      return new SQLiteAdapter(sqlite);
    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
}

module.exports = { createDatabaseAdapter };