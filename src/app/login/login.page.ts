import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AlmacenamientoService } from '../services/almacenamiento.service'; // Importa el servicio de almacenamiento

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPage {
  loginForm: FormGroup;

@ViewChild('logo', { read: ElementRef }) logo?: ElementRef<HTMLImageElement>;
@ViewChild('text', { read: ElementRef }) text?: ElementRef<HTMLImageElement>;

constructor(
  private fb: FormBuilder,
  private router: Router,
  private almacenamientoService: AlmacenamientoService // Inyecta el servicio de almacenamiento
) {
  this.loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8), Validators.pattern('^[a-zA-Z0-9]*$')]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]]
  });
}

async onLogin() {
  const username = this.loginForm.value.username; // Cambia this.form a this.loginForm
  const password = this.loginForm.value.password; // Cambia this.form a this.loginForm
  
  const usuarioValidado = await this.almacenamientoService.validarUsuario(username, password); // Cambia this.validacionService a this.almacenamientoService
  if (usuarioValidado) {
    console.log('Usuario validado correctamente', usuarioValidado);
    // Aquí puedes navegar a la página de inicio o hacer cualquier otra cosa que necesites
    this.router.navigate(['home']); // Asegúrate de navegar a la página de inicio
  } else {
    console.error('Usuario no autenticado');
    // Aquí puedes manejar el error, como mostrar un mensaje al usuario
  }
}


goToRegister() {
  this.router.navigate(['register']);
}

goToRecuperacion() {
  this.router.navigate(['/recuperacion']);
}
}
