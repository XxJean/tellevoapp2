import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { AlmacenamientoService } from '../services/almacenamiento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  usuarios: any[] = []; // Arreglo para almacenar los usuarios

constructor(
  private fb: FormBuilder,
  private router: Router,
  private almacenamientoService: AlmacenamientoService,
  private alertController: AlertController // Importación de AlertController
) {}

ngOnInit() {
  this.registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    tieneAuto: [false, Validators.required] // Cambiado para ser booleano
  });
}

async onRegister() {
  if (this.registerForm.valid) {
    const { username, password, tieneAuto } = this.registerForm.value;
    const newUser = { username, password, tieneAuto };

    const success: boolean = await this.almacenamientoService.agregarUsuario(newUser);

    if (success) {
      this.registerForm.reset();
      console.log('Usuario registrado con éxito');
      // Muestra la alerta y redirige al login
      this.mostrarAlerta();
    } else {
      console.error('El usuario ya existe');
    // Opcional: mostrar un mensaje de error al usuario
    }
  } else {
    console.error('Formulario no válido');
    this.registerForm.reset();
  }
}

async mostrarAlerta() {
  const alert = await this.alertController.create({
    header: 'Registro Exitoso',
    message: 'El usuario ha sido registrado correctamente.',
    buttons: [
      {
        text: 'OK',
        handler: () => {
          // Redirigir al login después de cerrar la alerta
          this.router.navigate(['/login']);
        }
      }
    ]
  });

await alert.present();
}

async cargarUsuarios() {
  this.usuarios = await this.almacenamientoService.obtenerUsuarios();
}

irAUsuarios() {
this.router.navigate(['usuarios']);
}
}
