import { Component, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { WeatherApi } from '../../services/weather-api/weather-api';
import { DailyWeatherModel } from '../../models/daily-weather.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forecast',
  imports: [CommonModule, RouterLink],
  templateUrl: './forecast.html',
  styleUrl: './forecast.scss',
})
export class Forecast {
  private route = inject(ActivatedRoute);
  private weatherApi = inject(WeatherApi);

  forecast: Signal<DailyWeatherModel | undefined>;
  zipcode: string = '';

  constructor() {
    this.zipcode = this.route.snapshot.paramMap.get('zipcode')!;

    if (this.zipcode) {
      const forecast$ = this.weatherApi.getForecast(this.zipcode);

      this.forecast = toSignal(forecast$);
    } else {
      this.forecast = toSignal(new Observable<DailyWeatherModel>());
    }
  }
}
