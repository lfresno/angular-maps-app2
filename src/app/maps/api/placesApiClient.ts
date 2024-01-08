
//se usa para reemplazar al http Client.
//es una version personalizada de http client

import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlacesApiClient extends HttpClient{

  public baseUrl : string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor( handler : HttpHandler ){
    super(handler); //nos permite usar las peticiones http igual que en el http client
  }

  //sobreeescribimos http get
  public override get<T>( url: string, options : {
    params? : HttpParams | {
      [param : string] : string | number | boolean | ReadonlyArray< string | number | boolean>;
    };
  }){

    url = this.baseUrl + url;

    //petición http.get
    return super.get<T>(url, {
      params:{
        //limit: '5',
        language: 'es',
        access_token: environment.apiKey,
        ...options.params
      }
    });
  }
}
