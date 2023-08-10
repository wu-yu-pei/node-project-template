import { Sequelize } from 'sequelize';
import Redis from 'ioredis';
import config from '../../config';

console.log(`|-> load db: mysql`);
console.log(`|-> load db: redis`);

const sequelize = new Sequelize(config.mysqlConfig);
const redis = new Redis(config.redisConfig);

export { sequelize, redis };
