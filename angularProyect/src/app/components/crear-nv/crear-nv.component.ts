import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-nv',
  templateUrl: './crear-nv.component.html',
  styleUrls: ['./crear-nv.component.css']
})
export class CrearNVComponent {
  usuario:any = sessionStorage.getItem('usuario');

  constructor(){
    if(this.usuario) this.usuario = JSON.parse(this.usuario);
  }
}
