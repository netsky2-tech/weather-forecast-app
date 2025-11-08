import { Injectable } from '@angular/core';

// Definimos una interfaz para la estructura de los datos guardados
interface CacheEntry<T>{
  data: T;
  expiry: number
}

@Injectable({
  providedIn: 'root',
})


export class Cache {

  // Tiempo por defecto: 2 horas en milisegundos
  private readonly DEFAULT_TTL = 2 * 60 * 60 * 1000;

  constructor() {}

  setItem<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const expiry = Date.now() + ttl;
    const cacheEntry: CacheEntry<T> = { data, expiry };

    try {
      localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (e) {
      console.error('Error saving to localstorage', e);
    }
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (!item) {
      return null;
    }

    try {
      const cacheEntry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();

      if (now > cacheEntry.expiry) {
        this.removeItem(key);
        return null;
      }

      return cacheEntry.data;
    } catch (e) {
      console.error('Error parsing cached data', e);
      this.removeItem(key);
      return null;
    }
  }

  // Metodo auxiliar para limpiar una entrada especifica
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Método opcional para limpiar toda la caché
  clear(): void {
    localStorage.clear();
  }
}
