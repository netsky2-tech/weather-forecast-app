import { Component, inject, OnInit, Signal, computed, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '../../services/location/location';
import { GenericTab, TabsContainer } from '../../components/tabs-container/tabs-container';
import { CurrentConditions } from '../../components/current-conditions/current-conditions';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, debounce, forkJoin, of, timer } from 'rxjs';
import { switchMap, map } from 'rxjs';
import { WeatherApi } from '../../services/weather-api/weather-api';
import { CurrentDataEntity } from '../../models/current-weather.model';


@Component({
  selector: 'app-weather-tabs',
  imports: [CommonModule, TabsContainer, CurrentConditions, RouterLink],
  templateUrl: './weather-tabs.html',
  styleUrl: './weather-tabs.scss',
})
export class WeatherTabs implements OnInit {
  ngOnInit(): void {
    this.requestedActiveTab.set(this.route.snapshot.queryParamMap.get('active'));
  }

  private locationService = inject(Location);
  private weatherApi = inject(WeatherApi);

  private route = inject(ActivatedRoute);

  locations: Signal<string[]> = this.locationService.locations;

  requestedActiveTab: WritableSignal<string | null> = signal(null);

  private locationSignal: Signal<string[]> = this.locationService.locations;

  private locations$: Observable<string[]> = toObservable(this.locationSignal);

  // Observable para el map de datos
  private weatherDataMap$: Observable<Map<string, CurrentDataEntity | null>> = this.locations$.pipe(
    debounce((zipcodes) => {
      if (zipcodes.length > 0) {
        return timer(0);
      }
      return timer(50);
    }),

    switchMap((zipcodes) => {
      if (zipcodes.length === 0) {
        return of(new Map<string, CurrentDataEntity | null>());
      }

      // El array de observables ahora devuelve el zip y los datos
      const locationRequests$ = zipcodes.map((zip) =>
        this.weatherApi.getCurrentConditions(zip).pipe(
          map((weatherData) => ({ zip, data: weatherData }))
          // Aquí podríamos añadir un .catchError() para manejar si un zipcode es inválido
        )
      );

      return forkJoin(locationRequests$).pipe(
        // Convertimos el array de resultados en un Mapa
        map((results) => {
          const dataMap = new Map<string, CurrentDataEntity | null>();
          results.forEach((result) => {
            dataMap.set(result.zip, result.data);
          });
          return dataMap;
        })
      );
    })
  );

  // Se converte el map en un signal
  public weatherDataMap: Signal<Map<string, CurrentDataEntity | null>> = toSignal(
    this.weatherDataMap$,
    { initialValue: new Map() }
  );

  public tabs: Signal<GenericTab[]> = computed(() => {
    const dataMap = this.weatherDataMap();

    // Usamos 'this.locations()' para mantener el orden original
    return this.locations().map((zip) => {
      if (!dataMap.has(zip)) {
        return { id: zip, title: `Cargando... (${zip})` };
      }

      const data = dataMap.get(zip);

      if (data === null) {
        return { id: zip, title: `Ubicación Inválida (${zip})` };
      }

      return {
        id: zip,
        title: data ? `${data.city_name} (${zip})` : `Cargando... (${zip})`,
      };
    });
  });

  onTabClosed(zipcode: string): void {
    this.locationService.removeLocation(zipcode);
  }
}
