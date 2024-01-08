import { Component, inject } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  private placesService = inject( PlacesService );
  private mapService = inject( MapService );

  public selectedId: string = '';

  get isLoadingPlaces() : boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places() : Feature[]{
    return this.placesService.places;
  }

  flyTo( place: Feature ){

    this.selectedId = place.id;

    const [lng, lat] = place.center;

    this.mapService.flyTo([lng, lat]);
  }

  getDirections( place : Feature ){

    if(!this.placesService.userLocation) throw new Error('No hay userlocation');

    this.placesService.deletePlaces();  //Borramos el array para que no salga el listado al seleccionar un luugar

    const start : [number, number] = this.placesService.userLocation;
    const end : [number, number]= place.center as [number, number];


    this.mapService.getRouteRetweenPoints(start, end);
  }

}
