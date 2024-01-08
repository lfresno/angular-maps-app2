import { Injectable, inject } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api/directionsApiClient copy';
import { DirectionResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private directionsApi = inject(DirectionsApiClient);

  //definimos y operamos con el mapa en el servicio, ya que este se va a estar usando en toda la app

  private map?: Map;
  private markers: Marker[] = [];

  get isMapReady() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw new Error('El mapa no está inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {

    if (!this.map) throw new Error('mapa no inicializado');

    this.markers.forEach(marker => marker.remove());   //borramos los markers de la búsqueda anterior
    const newMarkers = [];

    for (const place of places) {

      const [lng, lat] = place.center;

      const popup = new Popup()
        .setHTML(`
          <h6> ${place.text_es} </h6>
          <span> ${place.place_name_es} </span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if (places.length === 0) return;

    //hacemos que el mapa se coloque de forma que se vean todos los marcadores
    //se podría hacer así pero no siempre sabemos cuantos marcadores tenemos (dependerá de la búsqueda)
    // const bounds = new LngLatBounds(
    //   newMarkers[0].getLngLat(),
    //   newMarkers[0].getLngLat(),
    // );
    const bounds = new LngLatBounds();

    //se añaden lso límites de cada uno de los marcadores
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);  //para que tmbn se tenga en cuenta a la hora de pintar el mapa

    //para que no quede tan pegado a los límites, se añade algo de padding
    this.map.fitBounds(bounds, { padding: 200 });

  }


  //Directions api. RUTAS
  getRouteRetweenPoints(start: [number, number], end: [number, number]) {

    this.directionsApi.get<DirectionResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => {
        this.drawPolyline(resp.routes[0]);
        console.log(resp);
      });


  }

  private drawPolyline(route: Route) {

    if (!this.map) throw new Error('Mapa no inicializado');

    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });

    const coords = route.geometry.coordinates;
    const start = coords[0] as [number, number];

    //los bounds para que se vea bien el mapa
    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.map?.fitBounds(bounds);

    //polyline (línea de la ruta)
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ],
      }
    }

    //se borra la ruta anterior antes de calcular la nueva
    if (this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    //aspectos visuales de la ruta
    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    })

  }
}
