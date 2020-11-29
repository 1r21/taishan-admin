import { Injectable } from '@angular/core';
import { RequestCacheEntry } from './cache.interface';

@Injectable()
export class LocalStorageService {
  get(key: string): RequestCacheEntry {
    return JSON.parse(localStorage.getItem(key) || 'null') || null;
  }

  set(key: string, value: RequestCacheEntry) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
