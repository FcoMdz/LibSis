import { Component, OnInit } from '@angular/core';
import { SQLService } from 'src/app/services/sql.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{

  usuario!:any;
  iniciarSesion!:HTMLElement;
  administracion!:HTMLElement;
  ventas!:HTMLElement;
  clientes!:HTMLElement;
  compras!:HTMLElement;

  constructor(private sqlConection: SQLService){
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || "{}");
  }

  ngOnInit(): void {
    this.recuperarElementos();
    this.revisarUsuario();
  }

  recuperarElementos(){
    this.iniciarSesion = document.getElementById("IniciarSesion")!;
    this.administracion = document.getElementById("administracion")!;
    this.ventas = document.getElementById("ventas")!;
    this.clientes = document.getElementById("clientes")!;
    this.compras = document.getElementById("compras")!;
  }

  revisarUsuario(){
    this.administracion.style.display = "none";
    this.ventas.style.display = "none";
    this.clientes.style.display = "none";
    this.compras.style.display = "none"
    if(Object.keys(this.usuario).length != 0){
      this.iniciarSesion.style.display = "none";
      if(this.usuario.administrador) this.administracion.style.display = "block";
      if(this.usuario.vendedor || this.usuario.administrador) this.ventas.style.display = "block";
      if(this.usuario.vendedor || this.usuario.administrador) this.clientes.style.display = "block";
      if(this.usuario.almacenista || this.usuario.administrador) this.compras.style.display = "block";
    }
  }

}
