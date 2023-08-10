import { redis } from '../database/index';
import BaseCache from '../common/base/base.cache';
import { Redis } from 'ioredis';

class RedisCache extends BaseCache<Redis> {
  constructor() {
    super(redis);
  }

  async set(key, value, ttl) {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async hset(key, value, ttl) {
    await this.client.hset(key, )
  }

  async get(key) {
    const res = await this.client.get(key);
    return res && JSON.parse(res);
  }

  async del(key) {
    return await this.client.del(key);
  }

  async clearKeysByPattern(pattern) {
    const keys = await this.client.keys(pattern);

    for (const key of keys) {
      await this.client.del(key);
    }
  }
}

export default new RedisCache();
