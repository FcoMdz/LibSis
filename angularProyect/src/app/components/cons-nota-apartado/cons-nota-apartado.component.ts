import { Component, OnInit } from '@angular/core';
import { SQLService } from 'src/app/services/sql.service';

@Component({
  selector: 'app-cons-nota-apartado',
  templateUrl: './cons-nota-apartado.component.html',
  styleUrls: ['./cons-nota-apartado.component.css']
})
export class ConsNotaApartadoComponent implements OnInit {
  usuario: any = sessionStorage.getItem('usuario');
  notasapartado:notaapartado[] = []
  mostrarNotas: notaapartado[] = []
  busqueda:string = "";
  termino!:HTMLInputElement;
  constructor(private sql: SQLService){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
    await this.getNotasApartado()
  }

  async initBusqueda(){
    this.mostrarNotas = this.notasapartado;
    this.termino = <HTMLInputElement> document.getElementById("termino")!;
    this.termino.addEventListener("keyup",() => {
      this.mostrarNotas = [];
      if(this.termino!=undefined && this.termino.value!=""){
        this.busqueda = this.termino.value;
        this.notasapartado.forEach((na:notaapartado)=>{
          if(na.FolioNA.toString().includes(this.busqueda)){
            this.mostrarNotas.push(na);
          }
        });
      }else{
        this.busqueda = "";
        this.mostrarNotas = this.notasapartado;
      }
    });
  }

  async getNotasApartado(){
    (await this.sql.consulta(this.sql.URL + "/consulta/ConsNA")).forEach((notaapartado) =>{
      this.notasapartado = <notaapartado[]>notaapartado;
      this.initBusqueda()
    })
  }
}

interface notaapartado{
  FolioNA: Number
  Abono: Number
  Fecha: Date
  clienteId_cte: Number
  estatus:String
  nombre: String
}
