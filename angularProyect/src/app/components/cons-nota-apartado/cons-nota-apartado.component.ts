import { Component } from '@angular/core';

@Component({
  selector: 'app-cons-nota-apartado',
  templateUrl: './cons-nota-apartado.component.html',
  styleUrls: ['./cons-nota-apartado.component.css']
})
export class ConsNotaApartadoComponent {
  usuario: any = sessionStorage.getItem('usuario');
  constructor(){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }
}
