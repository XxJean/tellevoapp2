import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class XmapsService {

  constructor() { }

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;

    if (gModule && gModule.maps) {
      return Promise.resolve(gModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsApikey;
      script.async = true;
      script.defer = true;

      document.body.appendChild(script);

      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK is not available');
        }
      };

      // Manejo de error al cargar el script
      script.onerror = () => {
        reject('Failed to load Google Maps SDK');
      };
    });
  }
}



/**
 * Este servicio se encarga de cargar de manera dinámica el SDK de Google Maps
 * en el proyecto, verificando primero
 * si ya está disponible para evitar múltiples cargas.
 * La clave API se obtiene del entorno de producción (environment.prod.ts)
 * Si el SDK no está disponible o falla en cargarse, se lanza un error.
 */
