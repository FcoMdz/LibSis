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
  regProd!:HTMLElement;
  regNV!:HTMLElement;
  consNV!:HTMLElement;

  constructor(private sqlConection: SQLService){
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || "{}");
  }

  ngOnInit(): void {
    this.recuperarElementos();
    this.revisarUsuario();
  }

  recuperarElementos(){
    this.iniciarSesion = document.getElementById("IniciarSesion")!;
    this.regProd = document.getElementById("RegProd")!;
    this.regNV = document.getElementById("RegNV")!;
    this.consNV = document.getElementById("ConsNV")!;
  }

  revisarUsuario(){
    if(Object.keys(this.usuario).length === 0){
      this.regProd.style.display = "none";
      this.regNV.style.display = "none";
      this.consNV.style.display = "none";
    }else{
      this.iniciarSesion.style.display = "none";
      if(this.usuario.vendedor || this.usuario.administrador) this.regNV.style.display = "block";
      if(this.usuario.vendedor || this.usuario.administrador) this.regNV.style.display = "block";
      if(this.usuario.almacenista || this.usuario.administrador) this.regProd.style.display = "block";
    }
  }

}
