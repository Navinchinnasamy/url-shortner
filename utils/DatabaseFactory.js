import mongoose from 'mongoose';
import pkg from 'pg';
const { Client: PostgresClient } = pkg;
import mysql from 'mysql2/promise';

class DatabaseFactory {
  static async connect(databaseType) {
    const connectionString = this.getConnectionString(databaseType);

    try {
      if (databaseType === 'mongodb') {
        const connection = await mongoose.connect(connectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        return connection;
      } else if (databaseType === 'postgresql') {
        const client = new PostgresClient({ connectionString });
        await client.connect();
        console.log('Connected to PostgreSQL');
        return client;
      } else if (databaseType === 'mysql') {
        const connection = await mysql.createConnection(connectionString);
        console.log('Connected to MySQL');
        return connection;
      }
    } catch (error) {
      console.error(`Error connecting to ${databaseType}:`, error);
      throw error;
    }
  }

  static getConnectionString(databaseType) {
    const env = process.env;
    switch (databaseType) {
      case 'mongodb':
        const { MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = env;
        if (!MONGO_HOST || !MONGO_PORT || !MONGO_DB) {
          throw new Error('Missing MongoDB environment variables.');
        }
        return MONGO_USER && MONGO_PASSWORD
          ? `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`
          : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
      case 'postgresql':
        const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = env;
        if (!POSTGRES_HOST || !POSTGRES_PORT || !POSTGRES_DB) {
          throw new Error('Missing PostgreSQL environment variables.');
        }
        return POSTGRES_USER && POSTGRES_PASSWORD
          ? `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
          : `postgresql://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
      case 'mysql':
        const { MYSQL_HOST, MYSQL_PORT, MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD } = env;
        if (!MYSQL_HOST || !MYSQL_PORT || !MYSQL_DB) {
          throw new Error('Missing MySQL environment variables.');
        }
        return MYSQL_USER && MYSQL_PASSWORD
          ? `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DB}`
          : `mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DB}`;
      default:
        throw new Error(`Unsupported database type: ${databaseType}`);
    }
  }
}

export default DatabaseFactory;
