import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api/placesApiClient';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'  //el servicio es global
})
export class PlacesService {

  private http = inject(HttpClient);  //al final no se usa, ya que se creado uno personalizado
  private placesApiClient = inject( PlacesApiClient );
  private mapService  = inject(MapService);

  public userLocation?: [number, number] = undefined;
  public isLoadingPlaces : boolean = false;
  public places : Feature[] = [];

  get isUserLocationReady() : boolean {
    return !!this.userLocation;
  }

  //en cuanto un componente utilice este servicio, se ejecuta su constructor
  constructor() {
    this.getUserLocation();
  }


  public async getUserLocation() : Promise<[number, number]> {

    //se hace esto para transformar en una promesa el geolocation.position (que trabaja cn callbacks, no promesas)
    return new Promise( (resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        //success callback
        ({coords}) => {
          this.userLocation = [coords.longitude, coords.latitude];  //Se pone [long, lat] porque Mapbox los usa así
          resolve(this.userLocation); //resolve: resuelve la promesa.
        },

        //error callback
        (err) => {
          alert( 'No se pudo obtener la geolocalizacoión' );
          console.log( err );
          reject(); //manda el error de la promesa
        }
      )

    });
  }

  getPlacesByQuery( query: string = '') {
    if(query === '') return;
    if(!this.userLocation) throw new Error('No hay user location');

    this.isLoadingPlaces = true;

    this.placesApiClient.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: this.userLocation!.join(',')
      }
    })
      .subscribe( resp => {
        console.log(resp.features);

        this.isLoadingPlaces = false;
        this.places = resp.features;

        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);
      });
  }

  deletePlaces(){
    this.places = [];
  }
}
