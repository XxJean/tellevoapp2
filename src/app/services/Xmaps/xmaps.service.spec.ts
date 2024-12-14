import { TestBed } from '@angular/core/testing';

import { XmapsService } from './xmaps.service';

describe('XmapsService', () => {
  let service: XmapsService;

  beforeEach(() => {//hook para entornos de prueba
    TestBed.configureTestingModule({});//configura el modulo
    service = TestBed.inject(XmapsService);//una instancia de servicio, para que eeste disponible para pruebas
  });
  // prueba unitaria que verifica el comportamiento
  // esperado del servicio
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


/**
 * Este código realiza una prueba básica para el servicio
 * XmapsService en un proyecto.
 * Verifica que el servicio se pueda crear correctamente sin errores.
 * El entorno de pruebas se configura utilizando TestBed,
 * y se realiza una prueba simple
 * para comprobar que la instancia del servicio es válida.*/