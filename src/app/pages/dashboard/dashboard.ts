import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
// Se importa FormsModule para ngModel en componentes standalone
import { FormsModule } from '@angular/forms';
import { Location } from '../../services/location/location';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  private locationService = inject(Location);
  private router = inject(Router);

  zipcode: string ='';

  addLocation(): void {
    const trimmedZip = this.zipcode.trim();

    // No agregar si esta vacio
    if (!trimmedZip) {
      return;
    }
    // Llamado al servicio para agregar ubicacion
    this.locationService.addLocation(trimmedZip);

    // Navegacion hacia vista de pesta;as
    this.router.navigate(['/weather'], { queryParams: { active: trimmedZip } });

    // Limpieza del input
    this.zipcode='';
  }
}
