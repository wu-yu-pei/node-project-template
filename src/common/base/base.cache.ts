// Cache 基类

export default class BaseCache<T> {
  client: T;

  constructor(client: T) {
    this.client = client;
  }

  set(key, val, ttl) {}

  get(key) {}

  del(key) {}

  clearKeysByPattern(pattern: string) {}
}
