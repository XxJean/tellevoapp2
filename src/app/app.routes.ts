import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'recuperacion', loadComponent: () => import('./recuperacion/recuperacion.page').then(m => m.RecuperacionPage) },
  { path: 'register', loadComponent: () => import('./register/register.page').then(m => m.RegisterPage) },
  { path: 'usuarios', loadComponent: () => import('./usuarios/usuarios.page').then(m => m.UsuariosPage) },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'recuperacion', loadComponent: () => import('./recuperacion/recuperacion.page').then(m => m.RecuperacionPage) },
      { path: 'usuarios', loadComponent: () => import('./usuarios/usuarios.page').then(m => m.UsuariosPage) }
    ]
  }
];
