import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';
import { enviroment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherApi {
  private http = inject(HttpClient);
  private cache = inject(CacheService);

  private readonly baseUrl: string = enviroment.API_URL;
  private readonly apiKey: string = enviroment.API_KEY;

  // Metodo para obtener condiciones actuales
  getCurrentConditions(zipcode: string): Observable<any> {
    const cacheKey = `current_${zipcode}`;
    const cachedData = this.cache.getItem<any>(cacheKey);

    // Si hay cache valida se retorna como un Observable
    if (cachedData) {
      return of(cachedData);
    }

    // Si no, se realiza la peticion HTTP
    return this.http
      .get(`${this.baseUrl}/current`, {
        params: {
          postal_code: zipcode,
          key: this.apiKey,
          units: 'M',
        },
      })
      .pipe(
        // Extraer data relevante para mostrar al usuaroi
        map((response: any) => response.data[0]),
        // Se guarda en cache antes de devolver
        tap((data) => this.cache.setItem(cacheKey, data))
      );
  }

  getForecast(zipcode: string): Observable<any> {
    const cacheKey = `forecast_${zipcode}`;
    const cachedData = this.cache.getItem<any>(cacheKey);

    // Si hay cache valida se retorna como un Observable
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get(`${this.baseUrl}/forecast/daily`, {
      params: {
        postal_code: zipcode,
        key: this.apiKey,
        days: 5,
        units: 'M'
      }
    }).pipe(
      tap(data => this.cache.setItem(cacheKey, data));
    )
  };
}
