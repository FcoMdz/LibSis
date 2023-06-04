import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit{
  usuario:any = sessionStorage.getItem('usuario');
  options!:HTMLSelectElement;
  ISBN!:HTMLInputElement;
  nombre!:HTMLInputElement;
  precio!:HTMLInputElement;
  cantidad!:HTMLInputElement;
  impuesto!:HTMLInputElement;
  btnReg!:HTMLButtonElement;
  productos!:any;

  constructor(private sql:SQLService){
    if(this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
    await this.consProductos();
    this.options = <HTMLSelectElement>document.getElementById("options")!;
    this.ISBN = <HTMLInputElement>document.getElementById("isbn")!;
    this.nombre = <HTMLInputElement>document.getElementById("nombre")!;
    this.precio = <HTMLInputElement>document.getElementById("precio")!;
    this.cantidad = <HTMLInputElement>document.getElementById("cantidad")!;
    this.impuesto = <HTMLInputElement>document.getElementById("impuesto")!;
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
    this.initListeners();
  }

  initListeners(){
    this.options.addEventListener('change',(event) => {
      if(this.options.value != "0"){
        let body = {
          ISBN:this.options.value
        }
        this.sql.alta(this.sql.URL+"/consProd",body)
        .then((producto) => {
          let resultado = <producto[]>producto;
          if(resultado[0]){
            this.ISBN.disabled = true;
            this.ISBN.value = resultado[0].ISBN;
            this.nombre.value = resultado[0].nombre;
            this.precio.value = resultado[0].precio.toString();
            this.cantidad.value = resultado[0].existencias.toString();
            this.cantidad.min = resultado[0].existencias.toString();
            this.impuesto.value = resultado[0].impuesto.toString();
            this.btnReg.innerHTML = "Actualizar";
          }
        });
      }else{
        this.ISBN.removeAttribute('disabled');
        this.ISBN.value = "";
          this.nombre.value = "";
          this.precio.value = "";
          this.cantidad.value = "";
          this.cantidad.min = "";
          this.impuesto.value = "";
          this.btnReg.innerHTML = "Registrar";
      }
    })
  }

  async consProductos(){
    let consulta = await this.sql.consulta(this.sql.URL+"/consProds")
    consulta.forEach((producto)=>{
      this.productos = producto;
    });
  }

  registrarProducto(){
    let body = {
      ISBN: this.ISBN.value,
      nombre: this.nombre.value,
      precio: this.precio.value,
      existencias: this.cantidad.value,
      impuesto: this.impuesto.value
    }
    if(this.options.value == "0"){
      this.sql.alta(this.sql.URL+"/RegProd",body).then((res)=>{
        let respuesta = <res>res;
        if(respuesta.success){
          Swal.fire('Registro','Se ha registrado correctamente el producto','success')
        }else{
          Swal.fire('Registro','Ha ocurrido un error al registrar el producto ' + respuesta.err,'error')
        }
      })
    }else{
      this.sql.alta(this.sql.URL+"/ActProd",body).then((res)=>{
        let respuesta = <res>res;
        if(respuesta.success){
          Swal.fire('Actualizar','Se ha actualizado correctamente el producto','success')
        }else{
          Swal.fire('Actualizar','Ha ocurrido un error al actualizar el producto ' + respuesta.err,'error')
        }

      });
    }
  }

}

interface producto{
  success:boolean;
  ISBN:string;
  nombre:string;
  precio:number;
  existencias:number;
  impuesto:number;
}
