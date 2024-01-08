import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken = 'pk.eyJ1IjoibHVjaWFmcmVzbm81NSIsImEiOiJjbHF6MXpvc3QwMHVoMmtwNmN5eHIwMTU3In0.bD0pRs4y937GVGVWEylG4g';

if( !navigator.geolocation ) {
  alert('El navegador no soporta la geolocalización');
  throw new Error('El navegador no soporta la geolocalización');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
