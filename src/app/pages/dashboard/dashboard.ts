import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Location } from '../../services/location/location';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private locationService = inject(Location);
  private router = inject(Router);

  zipcode = signal<string>('');

  onZipcodeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.zipcode.set(input.value);
  }

  addLocation(): void {

    const trimmedZip = this.zipcode().trim();
    // No agregar si esta vacio
    if (!trimmedZip) {
      return;
    }
    // Llamado al servicio para agregar ubicacion
    this.locationService.addLocation(trimmedZip);

    // Navegacion hacia vista de pesta;as
    this.router.navigate(['/weather'], { queryParams: { active: trimmedZip } });

    // Limpieza del input
    this.zipcode.set('');
  }
}
