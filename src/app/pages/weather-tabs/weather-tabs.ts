import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '../../services/location/location';
import { GenericTab, TabsContainer } from '../../components/tabs-container/tabs-container';
import { CurrentConditions } from '../../components/current-conditions/current-conditions';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs';
import { WeatherApi } from '../../services/weather-api/weather-api';


@Component({
  selector: 'app-weather-tabs',
  imports: [CommonModule, TabsContainer, CurrentConditions, RouterLink],
  templateUrl: './weather-tabs.html',
  styleUrl: './weather-tabs.scss',
})
export class WeatherTabs implements OnInit {
  ngOnInit(): void {
    this.requestedActiveTab = this.route.snapshot.queryParamMap.get('active');
  }

  private locationService = inject(Location);
  private weatherApi = inject(WeatherApi);

  private route = inject(ActivatedRoute);

  locations: Signal<string[]> = this.locationService.locations;

  requestedActiveTab: string | null = null;

  private locationSignal: Signal<string[]> = this.locationService.locations;

  private locations$: Observable<string[]> = toObservable(this.locationSignal);

  private tabs$: Observable<GenericTab[]> = this.locations$.pipe(
    switchMap((zipcodes) => {
      // Si la lista está vacía, emitimos un array vacío
      if (zipcodes.length === 0) {
        return of([]);
      }

      // Creamos un array de observables (peticiones API)
      const locationRequests$ = zipcodes.map((zip) =>
        this.weatherApi.getCurrentConditions(zip).pipe(
          // Mapeamos la respuesta de Weather a nuestra interfaz GenericTab
          map((weatherData) => ({
            id: zip,
            title: `${weatherData.data?.[0]?.city_name} (${zip})`,
          }))
          // Aquí podríamos añadir un .catchError() para manejar si un zipcode es inválido
        )
      );

      // Ejecutamos todas las peticiones en paralelo
      return forkJoin(locationRequests$);
    })
  );

  public tabs:Signal<GenericTab[]> = toSignal(this.tabs$, { initialValue: [] });

  onTabClosed(zipcode: string): void {
    this.locationService.removeLocation(zipcode);
  }
}
