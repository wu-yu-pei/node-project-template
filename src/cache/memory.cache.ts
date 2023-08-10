import BaseCache from '../common/base/base.cache';
import NodeCache from 'node-cache';

class MemoryCache extends BaseCache<NodeCache> {
  constructor() {
    super(new NodeCache());
  }

  async set(key, value, ttl) {
    await this.client.set(key, JSON.stringify(value), ttl);
  }

  async get(key) {
    const res: string = await this.client.get(key);
    return res && JSON.parse(res);
  }

  async del(key) {
    return await this.client.del(key);
  }

  async clearKeysByPattern(pattern) {
    console.log(pattern,'------------------');

    const keys = this.client.keys();

    for (const key of keys) {
      if (pattern.test(key)) {
        this.client.del(key);
      }
    }
  }
}

export default new MemoryCache();
