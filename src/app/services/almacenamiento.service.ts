import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AlmacenamientoService {
  private storage: Storage | null = null;
  private keyUsuarios: string = 'usuarios';
  private keyRutas: string = 'rutas';
  private keyViajes: string = 'viajes';
  private keyLastUserId: string = 'lastUserId'; // Almacena el último ID de usuario

  constructor(private storageService: Storage) {
    this.init(); // Inicializa el almacenamiento
  }

  // Inicializa la instancia de almacenamiento
  async init() {
    this.storage = await this.storageService.create();
  }

  // Método para validar usuario y contraseña
  async validarUsuario(username: string, password: string): Promise<boolean> {
    if (!this.storage) return false;
    const usuarios = await this.obtenerUsuarios();
    const usuario = usuarios.find((u: any) => u.username === username && u.password === password);
    return usuario !== undefined;
  }

  // Obtiene el siguiente ID de usuario disponible
  private async getNextUserId(): Promise<number> {
    if (!this.storage) return 1;
    let lastId = await this.storage.get(this.keyLastUserId) || 0;
    const nextId = lastId + 1;
    await this.storage.set(this.keyLastUserId, nextId);
    return nextId;
  }

  // Agrega un nuevo usuario si no existe
  async agregarUsuario(usuario: any): Promise<boolean> {
    if (!this.storage) return false;
    const usuarios = await this.storage.get(this.keyUsuarios) || [];
    const existe = usuarios.find((u: any) => u.username === usuario.username);

    if (!existe) {
      const id = await this.getNextUserId();
      usuario.id = id;
      if (usuario.tieneAuto === undefined) {
        usuario.tieneAuto = false;
      }
      usuarios.push(usuario);
      await this.storage.set(this.keyUsuarios, usuarios);
      return true;
    }
    return false;
  }
  // Obtiene un usuario por su ID
async obtenerUsuarioPorId(id: number): Promise<any | null> {
  if (!this.storage) return null;
  const usuarios = await this.obtenerUsuarios();
  return usuarios.find((usuario) => usuario.id === id) || null;
}


  // Obtiene todos los usuarios almacenados
  async obtenerUsuarios(): Promise<any[]> {
    if (!this.storage) return [];
    return await this.storage.get(this.keyUsuarios) || [];
  }

  // Modifica un usuario por ID
  async modificarUsuarioPorId(id: number, nuevoNombre: string, tieneAuto: boolean): Promise<void> {
    if (!this.storage) return;
    const usuarios = await this.obtenerUsuarios();
    const usuario = usuarios.find((u: any) => u.id === id);

    if (usuario) {
      usuario.username = nuevoNombre;
      usuario.tieneAuto = Boolean(tieneAuto);
      await this.storage.set(this.keyUsuarios, usuarios);
    } else {
      console.error('Usuario no encontrado');
    }
  }

  // Elimina un usuario
  async eliminarUsuario(id: number): Promise<void> {
    if (!this.storage) return;
    const usuarios = await this.obtenerUsuarios();
    const usuariosFiltrados = usuarios.filter((usuario) => usuario.id !== id);
    await this.storage.set(this.keyUsuarios, usuariosFiltrados);
  }

  // Agrega una nueva ruta
  async agregarRuta(ruta: any): Promise<void> {
    if (!this.storage) return;
    const rutas = await this.storage.get(this.keyRutas) || [];
    if (ruta && ruta.nombre && ruta.disponible !== undefined) {
      rutas.push(ruta);
      await this.storage.set(this.keyRutas, rutas);
    } else {
      console.error('Ruta no válida', ruta);
    }
  }

  // Obtiene todas las rutas programadas
  async obtenerRutas(): Promise<any[]> {
    if (!this.storage) return [];
    return await this.storage.get(this.keyRutas) || [];
  }

  // Obtiene las rutas disponibles
  async getAvailableTrips(): Promise<any[]> {
    if (!this.storage) return [];
    const rutas = await this.obtenerRutas();
    return rutas.filter((ruta: any) => ruta.disponible === true);
  }

  // Guarda un viaje en el almacenamiento
  async saveTrip(viaje: any): Promise<void> {
    if (!this.storage) return;
    const viajes = await this.storage.get(this.keyViajes) || [];
    viajes.push(viaje);
    await this.storage.set(this.keyViajes, viajes);
  }

  // Selecciona una ruta y asigna el viaje
  async seleccionarRuta(usernameConAuto: string, rutaSeleccionada: any): Promise<void> {
    if (!this.storage) return;
    const usuarios = await this.storage.get(this.keyUsuarios) || [];
    const usuarioConAuto = usuarios.find((u: any) => u.username === usernameConAuto);

    if (usuarioConAuto) {
      const viaje = {
        username: usuarioConAuto.username,
        ruta: rutaSeleccionada,
        fecha: new Date(),
        pasajeros: 1,
      };

      await this.saveTrip(viaje);

      alert(`¡Viaje programado con éxito para ${usuarioConAuto.username} a la ruta ${rutaSeleccionada.nombre}!`);
    } else {
      alert(`Usuario ${usernameConAuto} no encontrado.`);
    }
  }
}
