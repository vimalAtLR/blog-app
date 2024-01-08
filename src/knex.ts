import knexConfig from './knexfile';
import Knex from 'knex';

const config = process.env.DB_ENV || 'locals';
// eslint-disable-next-line no-console
console.log('\n\nRead Connection is connected to ' + config);

const knex = Knex(knexConfig[config]);
export default knex;
