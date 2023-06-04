import { Component } from '@angular/core';

@Component({
  selector: 'app-consultar-nv',
  templateUrl: './consultar-nv.component.html',
  styleUrls: ['./consultar-nv.component.css']
})
export class ConsultarNvComponent {
  usuario:any = sessionStorage.getItem('usuario');

  constructor(){
    if(this.usuario) this.usuario = JSON.parse(this.usuario);
  }
}
