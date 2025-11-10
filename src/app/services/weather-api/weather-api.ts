import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Cache } from '../cache/cache'
import { enviroment } from '../../../environments/environment';
import { CurrentWeatherModel,Weather, CurrentDataEntity } from '../../models/current-weather.model'
import { DailyWeatherModel, DailyWeather, DailyDataEntity } from '../../models/daily-weather.model'

@Injectable({
  providedIn: 'root',
})
export class WeatherApi {
  private http = inject(HttpClient);
  private cache = inject(Cache);

  private readonly baseUrl: string = enviroment.API_URL;
  private readonly apiKey: string = enviroment.API_KEY;

  // Metodo para obtener condiciones actuales
  getCurrentConditions(zipcode: string): Observable<CurrentWeatherModel> {
    const cacheKey = `current_${zipcode}`;
    const cachedData = this.cache.getItem<CurrentWeatherModel>(cacheKey);

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
        // Extraer data relevante para mostrar al usuario
        // Se utiliza [0] por que el API retorna []
        //map((response: any) => response.data[0]),
        // Se guarda en cache antes de devolver
        tap((data) => this.cache.setItem(cacheKey, data))
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
      .pipe(
        tap((data) => this.cache.setItem(cacheKey, data))
      );
  }
}
