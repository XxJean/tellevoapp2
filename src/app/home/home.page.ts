import { Component, ElementRef, OnInit, Renderer2, ViewChild ,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { IonicModule, AlertController } from '@ionic/angular';
import { XmapsService } from '../services/Xmaps/xmaps.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlmacenamientoService } from '../services/almacenamiento.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class HomePage implements OnInit, AfterViewInit  {
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;
  googleMaps: any;
  map: any;
  markers: any[] = [];
  directionsService: any;
  directionsRenderer: any;
  routeForm: FormGroup;
  tieneAuto: boolean = true;
  distance: number | null = null;
  duration: string | null = null;
  tarifaTotal: number | null = null;
  showScheduleButton: boolean = false;
  availableTrips: any[] = [];
  selectedTrip: any = null;
  nombreUsuario: string | undefined;

constructor(
  private almacenamientoService: AlmacenamientoService,
  private xmaps: XmapsService,
  private renderer: Renderer2,
  private router: Router,
  private fb: FormBuilder,
  private alertController: AlertController,
) 
{
  this.routeForm = this.fb.group({
    startAddress: [''],
    endAddress: [''],
    startCoordinates: this.fb.group({
      lat: [''],
      lng: ['']
    }),
    endCoordinates: this.fb.group({
      lat: [''],
      lng: ['']
    })
  });
}


async ngOnInit() {
  const idUsuario = 1; // Asegúrate de que el ID del usuario es el correcto

  try {
    const usuario = await this.almacenamientoService.obtenerUsuarioPorId(idUsuario);

    if (usuario) {
      console.log('Usuario obtenido:', usuario);
      this.tieneAuto = usuario.tieneAuto;
      console.log('Valor de tieneAuto después de cargar:', this.tieneAuto);
    } else {
      console.log('Usuario no encontrado');
      this.router.navigate(['/login']);
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
  }

  if (this.tieneAuto) {
    this.loadAvailableTrips(); // Cargar viajes solo si tieneAuto es true
  } else {
    console.log('El usuario no tiene auto, no se pueden programar viajes');
  }
}


// Define el método loadAvailableTrips para cargar los viajes
loadAvailableTrips() {
  // Aquí puedes poner la lógica para obtener los viajes, por ejemplo:
  this.availableTrips = [
    // Simulación de viajes disponibles
    { id: 1, destino: 'Ciudad A', hora: '10:00' },
    { id: 2, destino: 'Ciudad B', hora: '12:00' },
  ];
  console.log('Viajes disponibles cargados:', this.availableTrips);
}

ngAfterViewInit() {
  console.log('Después de la vista, tieneAuto:', this.tieneAuto);  // Verificar el valor de tieneAuto
  this.loadMap();  // Llamar a la función para cargar el mapa
}


inicializarFormulario() {
  this.routeForm.reset(); // Limpiar el formulario en la inicialización
}


// Método que verifica la disponibilidad de transporte
checkAvailability() {
  // Simulando una llamada a un servicio para obtener las rutas disponibles
  setTimeout(() => {
    this.availableTrips = [
      { startAddress: 'Lugar A', endAddress: 'Lugar B', distance: 10 },
      { startAddress: 'Lugar C', endAddress: 'Lugar D', distance: 20 }
    ];
  }, 1000);  // Simulando un retraso de 1 segundo
}


async loadMap() {
  try {
    this.googleMaps = await this.xmaps.loadGoogleMaps();
    const mapEl = this.mapElementRef.nativeElement;
    const position = await Geolocation.getCurrentPosition();
    const location = new this.googleMaps.LatLng(position.coords.latitude, position.coords.longitude);

    this.map = new this.googleMaps.Map(mapEl, {
      center: location,
      zoom: 12,
    });
    this.renderer.addClass(mapEl, 'visible');
    this.directionsService = new this.googleMaps.DirectionsService();
    this.directionsRenderer = new this.googleMaps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    this.googleMaps.event.addListener(this.map, 'click', (event: any) => {
      this.handleMapClick(event.latLng);
    });
  } catch (e) {
    console.error('Error al cargar el mapa:', e);
  }
}


handleMapClick(latLng: any) {
  this.reverseGeocode(latLng).then(address => {
    const startAddressControl = this.routeForm.get('startAddress');
    const endAddressControl = this.routeForm.get('endAddress');

    if (startAddressControl && !startAddressControl.value) {
      startAddressControl.setValue(address);
      this.routeForm.get('startCoordinates')?.setValue({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    } else if (endAddressControl && !endAddressControl.value) {
      endAddressControl.setValue(address);
      this.routeForm.get('endCoordinates')?.setValue({
        lat: latLng.lat(),
        lng: latLng.lng()
      });
    }
  }).catch(error => {
    console.error('Error al obtener la dirección:', error);
  });
}



reverseGeocode(latLng: any): Promise<string> {
  const geocoder = new this.googleMaps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latLng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject('No se pudo obtener la dirección');
      }
    });
  });
}


async onSubmit() {
  const { startAddress, endAddress } = this.routeForm.value;
  try {
    const geocoder = new this.googleMaps.Geocoder();
    const startLocation = await this.geocodeAddress(startAddress, geocoder);
    const endLocation = await this.geocodeAddress(endAddress, geocoder);

    if (startLocation && endLocation) {
      this.clearMarkers();
      this.addMarker(startLocation);
      this.addMarker(endLocation);
      this.updateRoute(startLocation, endLocation);
    }
  } catch (e) {
    console.error('Error al calcular la ruta:', e);
  }
}


geocodeAddress(address: string, geocoder: any): Promise<any> {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        reject('No se pudo geocodificar la dirección: ' + status);
      }
    });
  });
}


addMarker(location: any) {
  const googleMaps = this.googleMaps;

  const icon = {
    url: 'assets/icons/logoLocation.png',
    scaledSize: new googleMaps.Size(50, 50)
  };

  const marker = new googleMaps.Marker({
    position: location,
    map: this.map,
    icon: icon,
    animation: googleMaps.Animation.DROP
  });

  this.markers.push(marker);
}


clearMarkers() {
  this.markers.forEach(marker => marker.setMap(null));
  this.markers = [];
}


updateRoute(startLocation: any, endLocation: any) {
  if (!startLocation || !endLocation) {
    return;
  }
  const googleMaps: any = this.googleMaps;
  const request = {
    origin: startLocation,
    destination: endLocation,
    travelMode: googleMaps.TravelMode.DRIVING
  };
  this.directionsService.route(request, (result: any, status: any) => {
    if (status === googleMaps.DirectionsStatus.OK) {
      this.directionsRenderer.setDirections(result);
      const route = result.routes[0].legs[0];
      this.distance = route.distance.text;
      this.duration = route.duration.text;
      this.tarifaTotal = this.calculateFare(route.distance.value / 1000);
    } else {
      console.error('Error al obtener la ruta:', status);
    }
  });
}


calculateFare(distance: number): number {
  const tarifaBase = 5;
  const costoPorKm = 1;
  return tarifaBase + (costoPorKm * distance);
}


scheduleRoute() {
  if (!this.routeForm.valid) {
    return;
  }
  
  const trip = {
    start: this.routeForm.value.startAddress,
    end: this.routeForm.value.endAddress,
    distance: this.distance,
    duration: this.duration,
    fare: this.tarifaTotal
  };
  
  this.availableTrips.push(trip);
  console.log('Ruta programada:', trip);
  this.presentAlert('Ruta programada con éxito.');
}


async presentAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Información',
    message: message,
    buttons: ['OK']
  });
  await alert.present();
}


selectTrip(trip: any) {
  this.selectedTrip = trip;
  console.log('Ruta seleccionada:', trip);
}

showRouteOnMap(trip: any) {
  if (!trip || !trip.start || !trip.end) {
    console.error('No se puede mostrar la ruta. Datos de la ruta incompletos.');
    return;
  }

  const googleMaps = this.googleMaps;
  const request = {
    origin: trip.start,
    destination: trip.end,
    travelMode: googleMaps.TravelMode.DRIVING
  };

  this.directionsService.route(request, (result: any, status: any) => {
    if (status === googleMaps.DirectionsStatus.OK) {
      this.directionsRenderer.setDirections(result);
      const route = result.routes[0].legs[0];
      this.distance = route.distance.text;
      this.duration = route.duration.text;
      this.tarifaTotal = this.calculateFare(route.distance.value / 1000);
      console.log('Ruta mostrada:', result);
    } else {
      console.error('Error al mostrar la ruta:', status);
    }
  });
}
}
