import { Injectable, signal, WritableSignal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Location {
  private readonly LOCATIONS_KEY = 'weather_locations';

  // Signal privado para mantener el estado
  private _locations: WritableSignal<string[]> = signal<string[]>(this.loadInitLocations());

  // Signal de solo lectura para que los componentes reaccionen a el, pero no modificarlo
  readonly locations = this._locations.asReadonly();

  constructor() {
    // Effect para guardar automaticamente en localstorage cada que el signal cambie
    effect(() => {
      this.saveLocationsToStorage(this._locations());
    });
  }

  addLocation(zipCode: string): void {
    const cleanZip = zipCode.trim();
    if (!cleanZip) return;

    this._locations.update((currentLocations) => {
      if (currentLocations.includes(zipCode)) {
        return currentLocations;
      }
      return [...currentLocations, cleanZip];
    });
  }

  removeLocation(zipCode: string): void {
    this._locations.update((currentLocations) => {
      return currentLocations.filter((loc) => loc !== zipCode);
    });
  }

  // Metodos auxiliares para persistencia de la lista

  private loadInitLocations(): string[] {
    const saved = localStorage.getItem(this.LOCATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveLocationsToStorage(locations: string[]): void {
    localStorage.setItem(this.LOCATIONS_KEY, JSON.stringify(locations));
  }
}
