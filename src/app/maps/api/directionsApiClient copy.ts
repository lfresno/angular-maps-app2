
//se usa para reemplazar al http Client.
//es una version personalizada de http client

import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DirectionsApiClient extends HttpClient{

  public baseUrl : string = 'https://api.mapbox.com/directions/v5/mapbox/driving';

  constructor( handler : HttpHandler ){
    super(handler); //nos permite usar las peticiones http igual que en el http client
  }

  //sobreeescribimos http get
  public override get<T>( url: string /*, options : {
    params? : HttpParams | {
      [param : string] : string | number | boolean | ReadonlyArray< string | number | boolean>;
    };
  }*/){

    url = this.baseUrl + url;

    //petición http.get
    return super.get<T>(url, {
      params:{
        alternatives: 'false',
        geometries: 'geojson',
        language: 'es',
        overview: 'simplified',
        steps: 'false',
        access_token: environment.apiKey,
        //...options.params
      }
    });
  }
}
