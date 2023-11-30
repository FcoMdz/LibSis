import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import Swal from 'sweetalert2';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  usuario: any = sessionStorage.getItem('usuario');
  btnReg!: HTMLButtonElement;
  optionProd!:datosProducto|null;
  productos: producto[] = []
  listaProds: producto[] = []
  autores: autores[] = []
  editoriales: editorial[] = []
  formUser = new FormGroup({
    'isbn': new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]),
    'nombre': new FormControl('', [Validators.required]),
    'precio': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]),
    'impuesto': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]),
    'editoriales': new FormControl<editorial[] | null>([], Validators.required),
    'autores': new FormControl<autores[] | null>([], Validators.required),
    'productos': new FormControl<producto | null>(null, Validators.required)
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
            this.loadProducto(this.optionProd)
          }
        });
    } else {
      this.limpiarFormulario()
      this.optionProd = null;
    }
  }

  loadProducto(dataProd: datosProducto){
    this.formUser.controls.isbn.setValue(dataProd.producto.ISBN)
    this.formUser.controls.nombre.setValue(dataProd.producto.nombre)
    this.formUser.controls.precio.setValue(dataProd.producto.precio.toString())
    this.formUser.controls.impuesto.setValue(dataProd.producto.impuesto.toString())
    this.formUser.controls.autores.setValue(<autores[]>dataProd.autores)
    this.formUser.controls.editoriales.setValue(<editorial[]>dataProd.editoriales)
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
  }

  async getData() {
    await this.consProductos();
    await this.consEditoriales();
    await this.consAutores();
  }

  limpiarFormulario() {
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    if(this.formUser.get('productos')?.value?.ISBN == '0'){
      this.formUser.reset({
        productos: this.formUser.get('productos')?.value
      })
    }else{
      this.formUser.reset()
    }

    this.btnReg.disabled = true;
  }

  async consProductos() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consProds")
    consulta.forEach((producto) => {
      this.productos = <producto[]>producto;
      this.productos.splice(0, 0, <producto>{
          existencias: 0,
          impuesto: 0,
          ISBN: '0',
          nombre: 'Nuevo Producto',
          precio: 0,
        })
    });
  }

  async consAutores() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consAutores")
    consulta.forEach((autores) => {
      this.autores = <autores[]>autores;
    });
  }

  async consEditoriales() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consEditoriales")
    consulta.forEach((editoriales) => {
      this.editoriales = <editorial[]>editoriales;
    });
  }

  registrarProducto() {
    if (this.formUser.controls.autores.value?.length == 0
        || this.formUser.controls.editoriales.value?.length == 0){
          Swal.fire({
            title: 'Registro de productos',
            text: 'Debe seleccionar al menos una editorial y autor',
            icon: 'info'
          })
          return;
        }
    let body = {
      ISBN: this.formUser.controls.isbn.value,
      ISBNant: this.optionProd?.producto.ISBN,
      nombre: this.formUser.controls.nombre.value,
      precio: this.formUser.controls.precio.value,
      impuesto: this.formUser.controls.impuesto.value,
      editoriales: this.formUser.controls.editoriales.value,
      autores: this.formUser.controls.autores.value
    }
    if (this.optionProd == null) {
      this.sql.alta(this.sql.URL + "/alta/Prod", body).then((res) => {
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
      this.sql.alta(this.sql.URL + "/cambio/Prod", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Actualizar', 'Se ha actualizado correctamente el producto', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Actualizar', 'Ha ocurrido un error al actualizar el producto, faltan datos', 'error')
        }

      });
    }
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

interface editorial {
  id_editorial: Number;
  nombre: String
  telefono: String;
}

interface autores{
  id_autor:Number;
  nombre: String;
}
