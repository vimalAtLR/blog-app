import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  locals: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'mysql',
      database: 'test',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    // debug: true,
  },
};

export default config;
