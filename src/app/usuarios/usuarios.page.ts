import { Component, OnInit } from '@angular/core';
import { AlmacenamientoService } from '../services/almacenamiento.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class UsuariosPage implements OnInit {
  usuario: any = {
    username: '',
    password: '',
    tieneAuto: false
  };

  usuarios: any[] = []; // Asegúrate de que usuarios sea un arreglo

  constructor(
    private almacenamientoService: AlmacenamientoService,
    private router: Router
  ) {}

  // Al cargar la página, obtenemos los datos de los usuarios
  async ngOnInit() {
    await this.obtenerUsuarios(); // Llamamos al método para obtener los usuarios
  }

  // Método para obtener todos los usuarios
  async obtenerUsuarios() {
    try {
      this.usuarios = await this.almacenamientoService.obtenerUsuarios(); // Asigna los usuarios obtenidos
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  }

  // Método para guardar cambios en un usuario
  async guardarCambios(usuario: any) {
    try {
      console.log('Usuario a modificar:', usuario); 
      
      // Se pasa el usuario actualizado al método de modificar
      await this.almacenamientoService.modificarUsuarioPorId(usuario.id, usuario.username, usuario.tieneAuto);

      console.log('Usuario modificado correctamente:', usuario);
      
      // Después de guardar los cambios, recargamos los usuarios para reflejar la actualización
      await this.obtenerUsuarios();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }

  // Método para eliminar un usuario
  async eliminarUsuario(username: string) {
    try {
      // Buscar el usuario por su nombre de usuario
      const usuarios = await this.almacenamientoService.obtenerUsuarios();
      const usuarioEncontrado = usuarios.find(u => u.username === username);

      if (usuarioEncontrado) {
        // Llamamos al servicio para eliminar el usuario usando su ID
        await this.almacenamientoService.eliminarUsuario(usuarioEncontrado.id);
        console.log('Usuario eliminado:', username);
        
        // Recargamos los usuarios después de la eliminación
        await this.obtenerUsuarios();
      } else {
        console.log('Usuario no encontrado para eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  }
}
