import { Sequelize } from 'sequelize';
import Redis from 'ioredis';
import config from '../../config';

console.log(`|-> load db: mysql`);
console.log(`|-> load db: redis`);

const sequelize = new Sequelize({
  username: config.database.username,
  password: config.database.password,
  port: config.database.port,
  host: config.database.host,
  database: config.database.database,
  dialect: 'mysql',
  logging: false,
});

const redis = new Redis(config.redisConfig);

export { sequelize, redis };
