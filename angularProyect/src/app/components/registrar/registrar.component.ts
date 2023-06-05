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
  editorial!:HTMLSelectElement;
  autor!:HTMLSelectElement;
  productos!:any;
  editoriales!:any;
  autores!:any;
  editorialesSelected:any[] = [];
  autoresSelected:any[] = [];
  editorialesPreSelected:any[] = [];
  autoresPreSelected:any[] = [];
  existencias:number = 0;

  constructor(private sql:SQLService){
    if(this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.options = <HTMLSelectElement>document.getElementById("options")!;
    this.ISBN = <HTMLInputElement>document.getElementById("isbn")!;
    this.nombre = <HTMLInputElement>document.getElementById("nombre")!;
    this.precio = <HTMLInputElement>document.getElementById("precio")!;
    this.cantidad = <HTMLInputElement>document.getElementById("cantidad")!;
    this.impuesto = <HTMLInputElement>document.getElementById("impuesto")!;
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
    this.editorial = <HTMLSelectElement>document.getElementById("editorial")!;
    this.autor = <HTMLSelectElement>document.getElementById("autor")!;
    this.initListeners();
  }

  async getData(){
    await this.consProductos();
    await this.consEditoriales();
    await this.consAutores();
  }

  limpiarFormulario(){
    this.ISBN.removeAttribute('disabled');
    this.ISBN.value = "";
    this.nombre.value = "";
    this.precio.value = "";
    this.cantidad.value = "";
    this.cantidad.min = "";
    this.impuesto.value = "";
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    this.deleteSelections(this.editorial, this.editorialesSelected);
    this.deleteSelections(this.autor, this.autoresSelected);
    this.editorialesSelected = [];
    this.autoresSelected = [];
    this.existencias = 0;
  }

  loadProducto(datosProducto:any){
    let datos = <datosProducto>datosProducto;
    let producto = datos.producto;
    this.autoresPreSelected = datos.autores;
    this.editorialesPreSelected = datos.editoriales;
    if(producto){
      this.ISBN.disabled = true;
      this.ISBN.value = producto.ISBN;
      this.nombre.value = producto.nombre;
      this.precio.value = producto.precio.toString();
      this.cantidad.value = producto.existencias.toString();
      this.cantidad.min = producto.existencias.toString();
      this.impuesto.value = producto.impuesto.toString();
      this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
      this.autoresSelected = [];
      this.existencias = producto.existencias;
      for (let i = 0; i < this.autor.options.length; i++) {
        const element = this.autor.options[i];
        element.selected = false;
        for (let j = 0; j < this.autoresPreSelected.length; j++) {
          const apl = this.autoresPreSelected[j];
          if(apl.autorIdAutor == element.value){
            this.autoresSelected.push(element.value);
            element.selected = true;
          }
        }
      }
      this.editorialesSelected = [];
      for (let i = 0; i < this.editorial.options.length; i++) {
        const element = this.editorial.options[i];
        element.selected = false;
        for (let j = 0; j < this.editorialesPreSelected.length; j++) {
          const apl = this.editorialesPreSelected[j];
          if(apl.editorialIdEditorial == element.value){
            this.editorialesSelected.push(element.value);
            element.selected = true;
          }
        }
      }
    }
  }

  initListeners(){
    this.options.addEventListener('change',(event) => {
      if(this.options.value != "0"){
        let body = {
          ISBN:this.options.value
        }
        this.sql.alta(this.sql.URL+"/consProd",body)
        .then((datosProducto) => {
          this.loadProducto(datosProducto);
        });
      }else{
        this.limpiarFormulario();
      }
    });
    this.editorial.addEventListener('change', (event) => {
      this.editorialesSelected = [];
      this.changeSelections(this.editorial, this.editorialesSelected);
    });
    this.autor.addEventListener('change', (event) => {
      this.autoresSelected = [];
      this.changeSelections(this.autor, this.autoresSelected);
    });
  }

  changeSelections(selection:HTMLSelectElement, array:any[]){
    for (let i = 0; i < selection.options.length; i++) {
      const element = selection.options[i];
      if(element.selected){
        array.push(element.value);
      }
    }
  }

  deleteSelections(selection:HTMLSelectElement, array:any[]){
    array = [];
    for (let i = 0; i < selection.options.length; i++) {
      const element = selection.options[i];
      element.selected = false;
    }
  }

  async consProductos(){
    let consulta = await this.sql.consulta(this.sql.URL+"/consProds")
    consulta.forEach((producto)=>{
      this.productos = producto;
    });
  }

  async consAutores(){
    let consulta = await this.sql.consulta(this.sql.URL+"/consAutores")
    consulta.forEach((autores)=>{
      this.autores = autores;
    });
  }

  async consEditoriales(){
    let consulta = await this.sql.consulta(this.sql.URL+"/consEditoriales")
    consulta.forEach((editoriales)=>{
      this.editoriales = editoriales;
    });
  }

  registrarProducto(){
    if(Number(this.cantidad.value) < this.existencias){
      Swal.fire('Cantidad','La cantidad ingresada es menor que las existencias actuales','error')
      return;
    }
    let autores:any[]|null = this.autoresSelected;
    let editoriales:any[]|null = this.editorialesSelected;
    if(this.autoresSelected.length == 0) autores = null;
    if(this.editorialesSelected.length == 0) editoriales = null;
    let body = {
      ISBN: this.ISBN.value,
      nombre: this.nombre.value,
      precio: this.precio.value,
      existencias: this.cantidad.value,
      impuesto: this.impuesto.value,
      editoriales: editoriales,
      autores: autores
    }
    if(this.options.value == "0"){
      this.sql.alta(this.sql.URL+"/RegProd",body).then((res)=>{
        let respuesta = <res>res;
        if(respuesta.success){
          Swal.fire('Registro','Se ha registrado correctamente el producto','success');
          this.limpiarFormulario();
          this.getData();
        }else{
          Swal.fire('Registro','Ha ocurrido un error al registrar el producto, faltan datos ','error');
        }
      })
    }else{
      this.sql.alta(this.sql.URL+"/ActProd",body).then((res)=>{
        let respuesta = <res>res;
        if(respuesta.success){
          Swal.fire('Actualizar','Se ha actualizado correctamente el producto','success');
          this.limpiarFormulario();
          this.getData();
        }else{
          Swal.fire('Actualizar','Ha ocurrido un error al actualizar el producto, faltan datos','error')
        }

      });
    }
    
  }

}

interface datosProducto{
  producto:producto;
  autores:any[];
  editoriales:any[];
}
interface producto{
  success:boolean;
  ISBN:string;
  nombre:string;
  precio:number;
  existencias:number;
  impuesto:number;
}
