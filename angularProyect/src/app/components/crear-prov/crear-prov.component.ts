import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { DropdownChangeEvent } from "primeng/dropdown"
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-prov',
  templateUrl: './crear-prov.component.html',
  styleUrls: ['./crear-prov.component.css']
})
export class CrearProvComponent implements OnInit {
  usuario: any = sessionStorage.getItem('usuario');
  btnReg!: HTMLButtonElement;
  btnElm!: HTMLButtonElement;
  proveedores!:any;
  option!:proveedor

  formUser = new FormGroup({
    'nombre': new FormControl('', [Validators.required]),
    'telefono': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$'),Validators.maxLength(10)]),
    'rfc': new FormControl('', [Validators.required, Validators.maxLength(13)]),
  });

  constructor(private sql: SQLService) {
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
    this.btnElm = <HTMLButtonElement>document.getElementById("btnElm")!;
  }

  async getData() {
    await this.consProveedores();
  }

  limpiarFormulario() {
    this.formUser.reset()
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    this.btnReg.disabled = true;
    this.btnElm.disabled = true;
  }

  loadProv(datosProv: any) {
    let datos = <proveedor>datosProv[0];
    let prov = datos;
    if (prov) {
      this.btnReg.disabled = false;
      this.formUser.controls.nombre.setValue(prov.nombre)
      this.formUser.controls.telefono.setValue(prov.telefono)
      this.formUser.controls.rfc.setValue(prov.RFC)
      this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
      this.btnElm.disabled = false;
      
    }
  }

  changeListener(evento:DropdownChangeEvent) {
    if (evento.value != null && evento.value.id_proveedor != "0") {
      let body = {
        idProv: evento.value.id_proveedor
      }
      this.sql.alta(this.sql.URL + "/consulta/ConsProv", body)
        .then((datosProv) => {
          if(datosProv!=undefined){
            this.option = (<proveedor[]>datosProv)[0]
            this.loadProv(datosProv);
          }
        });
    } else {
      this.option = this.proveedores[0]
      this.limpiarFormulario();
    }
  }


  deleteSelections(selection: HTMLSelectElement, array: any[]) {
    array = [];
    for (let i = 0; i < selection.options.length; i++) {
      const element = selection.options[i];
      element.selected = false;
    }
  }

  async consProveedores() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consProveedores")
    consulta.forEach((proveedor:any) => {
      console.log(proveedor)
      this.proveedores = proveedor;
      this.proveedores.splice(0, 0, <proveedor>{
        nombre: "Nuevo proveedor",
        telefono: "",
        RFC: "",
        id_proveedor: "0"
      })
    });
  }


  registrarProv() {
    let body = {
      idProv: this.option.id_proveedor,
      nombre: this.formUser.controls.nombre.value,
      telefono: this.formUser.controls.telefono.value?.toString(),
      rfc: this.formUser.controls.rfc.value,
    }
    console.log(body)
    if (this.option.id_proveedor == "0") {
      this.sql.alta(this.sql.URL + "/alta/Prov", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Registro', 'Se ha registrado correctamente el proveedor', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Registro', 'Ha ocurrido un error al registrar el proveedor, faltan datos ' + respuesta.err, 'error');
        }
      })
    } else {
      this.sql.alta(this.sql.URL + "/cambio/Prov", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Actualizar', 'Se ha actualizado correctamente el proveedor', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Actualizar', 'Ha ocurrido un error al actualizar el proveedor, faltan datos', 'error')
        }

      });
    }
  }
  eliminarProv(){
    let body = {
      idProv: this.option.id_proveedor
    }
      this.sql.alta(this.sql.URL + "/baja/Prov",body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Eliminado', 'Se ha eliminado correctamente el proveedor', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Eliminado', 'Ha ocurrido un error al eliminar el proveedor' + respuesta.err, 'error');
        }
      })
    
    }
  }


interface proveedor {
  nombre: string;
  telefono: string;
  RFC: string;
  id_proveedor: string;
}
