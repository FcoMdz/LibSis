import { Component } from '@angular/core';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {
  usuario:any = sessionStorage.getItem('usuario');

  constructor(){
    if(this.usuario) this.usuario = JSON.parse(this.usuario);
  }
}
