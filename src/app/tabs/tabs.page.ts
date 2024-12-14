import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';  // Importa RouterModule aquí

@Component({
selector: 'app-tabs',
templateUrl: './tabs.page.html',
styleUrls: ['./tabs.page.scss'],
standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]  // Agrega RouterModule aquí
})
export class TabsPage implements OnInit {
constructor() {}

ngOnInit() {}
}
