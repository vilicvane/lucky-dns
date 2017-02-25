import { generateMD5Hex } from './crypto';

interface CacheData<T> {
  expires: number;
  value: T;
}

export class Cache<TKey, TValue> {
  constructor(
    private timeout = 30 * 60 * 1000
  ) { }

  private map = new Map<TKey, CacheData<TValue>>();

  set(key: TKey, value: TValue, timeout = this.timeout): void {
    this.map.set(key, {
      expires: Date.now() + timeout,
      value
    });
  }

  get(key: TKey): TValue | undefined {
    let data = this.map.get(key);

    if (!data) {
      return undefined;
    }

    if (data.expires < Date.now()) {
      this.map.delete(key);
      return undefined;
    }

    return data.value;
  }
}

export class MessageCache {
  cache = new Cache<string, Buffer>();

  set(key: Buffer, value: Buffer): void {
    let keyMd5 = generateMD5Hex(key);
    this.cache.set(keyMd5, value);
  }

  get(key: Buffer): Buffer | undefined {
    let keyMd5 = generateMD5Hex(key);
    return this.cache.get(keyMd5);
  }
}
