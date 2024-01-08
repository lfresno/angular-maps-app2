import { Component, inject } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

  private placesService = inject( PlacesService );
  private mapService = inject( MapService );

  goToMyLocation() {

    if( !this.placesService.userLocation ) throw new Error(' No hay ubicación de usuario ');
    if( !this.mapService.isMapReady ) throw new Error('No se ha inicializado el mapa');

    this.mapService.flyTo(this.placesService.userLocation!);
  }

}
