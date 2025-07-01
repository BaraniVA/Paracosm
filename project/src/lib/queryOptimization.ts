import { useEffect, useRef, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface QueryCacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
}

class QueryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;

  constructor(options: QueryCacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
  }

  set<T>(key: string, data: T, ttl: number = 300000): void { // Default 5 minutes
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const queryCache = new QueryCache();

// Hook for cached queries
export function useCachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: { ttl?: number; enabled?: boolean } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { ttl = 300000, enabled = true } = options; // Default 5 minutes

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      // Check cache first
      const cachedData = queryCache.get<T>(key);
      if (cachedData) {
        setData(cachedData);
        return;
      }

      // Abort previous request if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const result = await queryFn();
        queryCache.set(key, result, ttl);
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [key, enabled, ttl, queryFn]);

  return { data, loading, error };
}

// Hook for request deduplication
export function useRequestDeduplication() {
  const pendingRequests = useRef(new Map<string, Promise<unknown>>());

  const dedupedRequest = async <T>(key: string, requestFn: () => Promise<T>): Promise<T> => {
    // If request is already pending, return the existing promise
    if (pendingRequests.current.has(key)) {
      return pendingRequests.current.get(key)! as Promise<T>;
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up after request completes
      pendingRequests.current.delete(key);
    });

    pendingRequests.current.set(key, promise);
    return promise;
  };

  return { dedupedRequest };
}

// Utility to generate cache keys
export function createCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return `${prefix}:${sortedParams}`;
}

// Hook for batching multiple requests
export function useBatchedRequests<T>(batchSize: number = 10, delay: number = 100) {
  const batch = useRef<Array<{ key: string; request: () => Promise<T>; resolve: (value: T) => void; reject: (error: unknown) => void }>>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addToBatch = (key: string, request: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      batch.current.push({ key, request, resolve, reject });

      // Execute batch if it's full
      if (batch.current.length >= batchSize) {
        executeBatch();
      } else {
        // Set timeout to execute batch
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(executeBatch, delay);
      }
    });
  };

  const executeBatch = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const currentBatch = [...batch.current];
    batch.current = [];

    // Execute all requests in parallel
    const results = await Promise.allSettled(
      currentBatch.map(({ request }) => request())
    );

    // Resolve/reject individual promises
    results.forEach((result, index) => {
      const { resolve, reject } = currentBatch[index];
      if (result.status === 'fulfilled') {
        resolve(result.value);
      } else {
        reject(result.reason);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { addToBatch };
}
