import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { DropdownChangeEvent } from "primeng/dropdown"
import Swal from 'sweetalert2';
@Component({
  selector: 'app-crear-em',
  templateUrl: './crear-em.component.html',
  styleUrls: ['./crear-em.component.css']
})
export class CrearEmComponent implements OnInit{
  usuario: any = sessionStorage.getItem('usuario');
  btnReg!: HTMLButtonElement;
  btnElm!: HTMLButtonElement;
  empleados!:any;
  option!:empleado;
  formUser = new FormGroup({
    'usuario': new FormControl('', [Validators.required,Validators.maxLength(20)]),
    'nombre': new FormControl('', [Validators.required]),
    'contrasena': new FormControl('', [Validators.required]),
    'enccompras': new FormControl('',[Validators.required]),
    'vendedor': new FormControl('',[Validators.required]),
    'administrador': new FormControl('',[Validators.required])
  });
  ngOnInit(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  constructor(private sql: SQLService){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async getData(){
    await this.consEmpleados();
  }

  async consEmpleados(){
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consEmpleados")
    consulta.forEach((empleado:any) => {
      this.empleados = empleado;
    });
  }
  limpiarFormulario() {
    this.formUser.reset()
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    this.btnReg.disabled = true;
  }
  loadEm(datosEm: any){
    let datos = <empleado>datosEm[0];
    let empleado = datos;
    if(empleado){
      this.btnReg.disabled = false;
      this.formUser.controls.nombre.setValue(empleado.nombre)
      this.formUser.controls.usuario.setValue(empleado.usuario)
      this.formUser.controls.contrasena.setValue(empleado.contrasena)
      this.formUser.controls.enccompras.setValue(empleado.enccompras.toString())
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
              this.option = (<empleado[]>datosProv)[0]
              this.loadEm(datosProv);
            }
          });
      } else {
        this.option = this.empleados[0]
        this.limpiarFormulario();
      }
    }
    
  registrarEmpleado() {
    let body = {
      usuario: this.option.usuario,
      nombre: this.formUser.controls.nombre.value,
      contrasena: this.formUser.controls.contrasena,
      vendedor: this.formUser.controls.vendedor,
      enccompras: this.formUser.controls.enccompras,
      administrador: this.formUser.controls.administrador
    }
    console.log(body)
    if (this.option.usuario == " ") {
      this.sql.alta(this.sql.URL + "/alta/Emp", body).then((res) => {
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
  eliminarEmpleado(){
    let body = {
      usuario: this.option.usuario
    }
      this.sql.alta(this.sql.URL + "/baja/Emp",body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Eliminado', 'Se ha eliminado correctamente el Empleado', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Eliminado', 'Ha ocurrido un error al eliminar el Empleado' + respuesta.err, 'error');
        }
      })
    
    }
}

interface empleado{
  usuario: string;
  nombre: string;
  contrasena: string;
  vendedor: number;
  enccompras: number;
  administrador : number;
}