import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 3600,
  checkperiod: 300,
  useClones: false,
});

export const cacheGet = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const cacheSet = <T>(key: string, value: T, ttl?: number): boolean => {
  if (ttl) {
    return cache.set(key, value, ttl);
  }
  return cache.set(key, value);
};

export const cacheDel = (key: string): number => {
  return cache.del(key);
};

export const cacheFlush = (): void => {
  cache.flushAll();
};

export const cacheKeys = (): string[] => {
  return cache.keys();
};

export const cacheStats = () => {
  return cache.getStats();
};

export const generateCacheKey = (...parts: (string | number | object)[]): string => {
  return parts
    .map((part) => {
      if (typeof part === "object") {
        return JSON.stringify(part);
      }
      return String(part);
    })
    .join(":");
};

export const cacheMiddleware = (ttl?: number) => {
  return (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = generateCacheKey(req.originalUrl || req.url, req.query);

    const cachedData = cacheGet(key);

    if (cachedData) {
      return res.json(cachedData);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (data && data.success !== false) {
        cacheSet(key, data, ttl);
      }
      return originalJson(data);
    };

    next();
  };
};

export class DataCache {
  private cache: NodeCache;

  constructor(defaultTTL = 3600) {
    this.cache = new NodeCache({
      stdTTL: defaultTTL,
      checkperiod: 300,
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || this.cache.getTtl(key));
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  keys(): string[] {
    return this.cache.keys();
  }

  size(): number {
    return this.cache.keys().length;
  }
}

export const createProjectCache = () => new DataCache(1800);
export const createBlogCache = () => new DataCache(900);
export const createSettingsCache = () => new DataCache(7200);

export default cache;
