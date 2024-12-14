import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

declare let google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule],  // Asegúrate de incluir IonicModule aquí
  templateUrl: './app.component.html',  // Este es el archivo de tu plantilla
  styleUrls: ['./app.component.scss'],  // Este es el archivo de tus estilos
})
export class AppComponent {
  constructor() {
    // Vincula initMap al objeto window
    (window as any).initMap = this.initMap.bind(this);
  }

  // Define la función initMap
  initMap() {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
}

