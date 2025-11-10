import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { WeatherApi } from '../../services/weather-api/weather-api';
import { DailyWeatherModel } from '../../models/daily-weather.model';

@Component({
  selector: 'app-forecast',
  imports: [CommonModule, RouterLink],
  templateUrl: './forecast.html',
  styleUrl: './forecast.scss',
})
export class Forecast {
  private route = inject(ActivatedRoute);
  private weatherApi = inject(WeatherApi);

  forecast$!: Observable<DailyWeatherModel>;
  zipcode: string = '';

  ngOnInit() {
    // Obtener el zipcode del parametro de la ruta
    this.zipcode = this.route.snapshot.paramMap.get('zipcode')!;

    if (this.zipcode) {
      this.forecast$ = this.weatherApi.getForecast(this.zipcode);
    }
  }
}
