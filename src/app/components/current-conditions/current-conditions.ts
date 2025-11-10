import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { WeatherApi } from '../../services/weather-api/weather-api';
import {  CurrentWeatherModel } from '../../models/current-weather.model';

@Component({
  selector: 'app-current-conditions',
  imports: [CommonModule, RouterLink],
  templateUrl: './current-conditions.html',
  styleUrl: './current-conditions.scss',
})
export class CurrentConditions implements OnInit {

  // Se recibe el zipcode como Input, se usa definite assignment assertion,
  // ya que el valor sera inyectado por Angular, no dentro del constructor
  @Input({ required: true }) zipcode!: string;

  private weatherApi = inject(WeatherApi);

  // Uso de Observable para manejar el estado y tipo
  conditions: CurrentWeatherModel | null = null;

ngOnInit(): void {
  if (this.zipcode) {
    this.weatherApi.getCurrentConditions(this.zipcode)
      .subscribe(data => {
        this.conditions = data;
      });
  }
}

}
