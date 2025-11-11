import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Cache } from '../cache/cache'
import { environment } from '../../../environments/environment';
import { CurrentWeatherModel, CurrentDataEntity } from '../../models/current-weather.model'
import { DailyWeatherModel } from '../../models/daily-weather.model'

@Injectable({
  providedIn: 'root',
})
export class WeatherApi {
  private http = inject(HttpClient);
  private cache = inject(Cache);

  private readonly baseUrl: string = environment.API_URL;
  private readonly apiKey: string = environment.API_KEY;

  // Metodo para obtener condiciones actuales
  getCurrentConditions(zipcode: string): Observable<CurrentDataEntity | null> {
    const cacheKey = `current_${zipcode}`;
    const cachedData = this.cache.getItem<CurrentDataEntity>(cacheKey);

    // Si hay cache valida se retorna como un Observable
    if (cachedData) {
      return of(cachedData);
    }

    // Si no, se realiza la peticion HTTP
    return this.http
      .get<CurrentWeatherModel>(`${this.baseUrl}/current`, {
        params: {
          postal_code: zipcode,
          key: this.apiKey,
          units: 'M',
        },
      })
      .pipe(
        map((response: CurrentWeatherModel) => {
          const data = response.data;
          if (data && data.length > 0) {
            return data[0];
          }

          return null;
        }),
        tap((cleanData) => this.cache.setItem(cacheKey, cleanData))
      );
  }

  // Metodo para obtener pronosticos diarios
  getForecast(zipcode: string): Observable<DailyWeatherModel> {
    const cacheKey = `forecast_${zipcode}`;
    const cachedData = this.cache.getItem<DailyWeatherModel>(cacheKey);

    // Si hay cache valida se retorna como un Observable
    if (cachedData) {
      return of(cachedData);
    }

    return this.http
      .get<DailyWeatherModel>(`${this.baseUrl}/forecast/daily`, {
        params: {
          postal_code: zipcode,
          key: this.apiKey,
          days: 5,
          units: 'M',
        },
      })
      .pipe(tap((data) => this.cache.setItem(cacheKey, data)));
  }
}
