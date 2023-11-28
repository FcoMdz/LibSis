import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-prov',
  templateUrl: './crear-prov.component.html',
  styleUrls: ['./crear-prov.component.css']
})
export class CrearProvComponent implements OnInit {
  usuario: any = sessionStorage.getItem('usuario');
  options!: HTMLSelectElement;
  nombre!: HTMLInputElement;
  telefono!: HTMLInputElement;
  rfc!: HTMLInputElement;
  btnReg!: HTMLButtonElement;
  proveedores!:any;

  formUser = new FormGroup({
    'nombre': new FormControl('', [Validators.required]),
    'telefono': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]),
    'rfc': new FormControl('', [Validators.required, Validators.maxLength(13)]),
  });

  constructor(private sql: SQLService) {
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.options = <HTMLSelectElement>document.getElementById("options")!;
    this.nombre = <HTMLInputElement>document.getElementById("nombre")!;
    this.telefono = <HTMLInputElement>document.getElementById("telefono")!;
    this.rfc = <HTMLInputElement>document.getElementById("rfc")!;
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
    this.initListeners();
  }

  async getData() {
    await this.consProveedores();
  }

  limpiarFormulario() {
    this.nombre.value = "";
    this.telefono.value = "";
    this.rfc.value = "";
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    this.btnReg.disabled = true;
  }

  loadProv(datosProv: any) {
    let datos = <proveedor>datosProv;
    let prov = datos;
    if (prov) {
      this.btnReg.disabled = false;
      this.nombre.value = prov.nombre;
      this.telefono.value = prov.telefono.toString();
      this.rfc.value = prov.rfc.toString();
      this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
  
    }
  }

  initListeners() {
    this.options.addEventListener('change', (event) => {
      if (this.options.value != "0") {
        let body = {
          idProv: this.options.value
        }
        this.sql.alta(this.sql.URL + "/consProv", body)
          .then((datosProv) => {
            this.loadProv(datosProv);
          });
      } else {
        this.limpiarFormulario();
      }
    });

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

  async consProveedores() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consProv")
    consulta.forEach((proveedor:any) => {
      this.proveedores = proveedor;
    });
  }


  registrarProv() {
    let body = {
      nombre: this.nombre.value,
      telefono: this.telefono.value,
      rfc: this.rfc.value,
    }
    if (this.options.value == "0") {
      this.sql.alta(this.sql.URL + "/alta/RegProv", body).then((res) => {
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
      this.sql.alta(this.sql.URL + "/ActProv", body).then((res) => {
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



}

interface proveedor {
  success: boolean;
  nombre: string;
  telefono: number;
  rfc: number;
}
