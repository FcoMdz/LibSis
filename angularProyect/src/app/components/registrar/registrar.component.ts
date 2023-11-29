import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import Swal from 'sweetalert2';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { MultiSelectChangeEvent } from 'primeng/multiselect';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  usuario: any = sessionStorage.getItem('usuario');
  btnReg!: HTMLButtonElement;
  optionProd!:datosProducto|null
  editorialesSelected: any[] = [];
  autoresSelected: any[] = [];
  editorialesPreSelected: any[] = [];
  autoresPreSelected: any[] = [];
  existencias: number = 0;
  productos: any = []
  autores: any = []
  editoriales: any = []
  formUser = new FormGroup({
    'isbn': new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]),
    'nombre': new FormControl('', [Validators.required]),
    'precio': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]),
    'impuesto': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]),
  });

  constructor(private sql: SQLService) {
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  changeListenerProd(evento:DropdownChangeEvent) {
    if (evento.value != null && evento.value.ISBN != "0") {
      let body = {
        ISBN: evento.value.ISBN
      }
      this.sql.alta(this.sql.URL + "/consulta/consProd", body)
        .then((datosProd:any) => {
          if(datosProd!=undefined){
            this.optionProd = <datosProducto>datosProd
            console.log(this.optionProd)
            this.loadProducto(this.optionProd)
          }
        });
    } else {
      this.optionProd = null;
    }
  }

  loadProducto(dataProd: datosProducto){
    this.formUser.controls.isbn.setValue(dataProd.producto.ISBN)
    this.formUser.controls.nombre.setValue(dataProd.producto.nombre)
    this.formUser.controls.precio.setValue(dataProd.producto.precio.toString())
    this.formUser.controls.impuesto.setValue(dataProd.producto.impuesto.toString())
  }

  changeListenerEdit(evento: MultiSelectChangeEvent){
    console.log(evento)
  }

  changeListenerAut(evento: MultiSelectChangeEvent){
    console.log(evento)
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
    this.initListeners();
  }

  async getData() {
    await this.consProductos();
    await this.consEditoriales();
    await this.consAutores();
  }

  limpiarFormulario() {
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    this.formUser.reset()
    this.editorialesSelected = [];
    this.autoresSelected = [];
    this.existencias = 0;
    this.btnReg.disabled = true;
  }

  initListeners() {
    /*this.options.addEventListener('change', (event) => {
      if (this.options.value != "0") {
        let body = {
          ISBN: this.options.value
        }
        this.sql.alta(this.sql.URL + "/consProd", body)
          .then((datosProducto) => {
            this.loadProducto(datosProducto);
          });
      } else {
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
    });*/
  }

  changeSelections(selection: HTMLSelectElement, array: any[]) {
    for (let i = 0; i < selection.options.length; i++) {
      const element = selection.options[i];
      if (element.selected) {
        array.push(element.value);
      }
    }
  }

  deleteSelections(selection: HTMLSelectElement, array: any[]) {
    array = [];
    for (let i = 0; i < selection.options.length; i++) {
      const element = selection.options[i];
      element.selected = false;
    }
  }

  async consProductos() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consProds")
    consulta.forEach((producto) => {
      this.productos = producto;
    });
  }

  async consAutores() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consAutores")
    consulta.forEach((autores) => {
      this.autores = autores;
    });
  }

  async consEditoriales() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consEditoriales")
    consulta.forEach((editoriales) => {
      this.editoriales = editoriales;
    });
  }

  registrarProducto() {
    /*if (Number(this.cantidad.value) < this.existencias) {
      Swal.fire('Cantidad', 'La cantidad ingresada es menor que las existencias actuales', 'error')
      return;
    }
    let autores: any[] | null = this.autoresSelected;
    let editoriales: any[] | null = this.editorialesSelected;
    if (this.autoresSelected.length == 0) autores = null;
    if (this.editorialesSelected.length == 0) editoriales = null;
    let body = {
      ISBN: this.ISBN.value,
      nombre: this.nombre.value,
      precio: this.precio.value,
      existencias: this.cantidad.value,
      impuesto: this.impuesto.value,
      editoriales: editoriales,
      autores: autores
    }
    if (this.options.value == "0") {
      this.sql.alta(this.sql.URL + "/RegProd", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Registro', 'Se ha registrado correctamente el producto', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Registro', 'Ha ocurrido un error al registrar el producto, faltan datos ', 'error');
        }
      })
    } else {
      this.sql.alta(this.sql.URL + "/ActProd", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Actualizar', 'Se ha actualizado correctamente el producto', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Actualizar', 'Ha ocurrido un error al actualizar el producto, faltan datos', 'error')
        }

      });
    }*/

  }

  setButtinDisabled() {

  }

}

interface datosProducto {
  producto: producto;
  autores: any[];
  editoriales: any[];
}
interface producto {
  success: boolean;
  ISBN: string;
  nombre: string;
  precio: number;
  existencias: number;
  impuesto: number;
}
