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
  empleados:empleado[]=[];
  option!:empleado;
  formUser = new FormGroup({
    'usuario': new FormControl('', [Validators.required, Validators.maxLength(20)]),
    'nombre': new FormControl('', [Validators.required]),
    'contrasena': new FormControl('', [Validators.required]),
    'enccompras': new FormControl(false),
    'vendedor': new FormControl(false),
    'administrador': new FormControl(false)
  });


  constructor(private sql: SQLService){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
    this.btnElm = <HTMLButtonElement>document.getElementById("btnElm")!;
  }

  async getData(){
    await this.consEmpleados();
  }

  async consEmpleados(){
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/ConsEmpleados")
    consulta.forEach((empleado:any) => {
      this.empleados = empleado;
      this.empleados.splice(0, 0, <empleado>{
        nombre: "Nuevo empelado",
        administrador: 0,
        contrasena: '',
        enccompras: 0,
        usuario: 'Nuevo',
        vendedor: 0
      })
    });
  }
  limpiarFormulario() {
    this.formUser.reset()
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
  }
  loadEm(empleado: empleado){
    if(empleado){
      this.formUser.controls.nombre.setValue(empleado.nombre)
      this.formUser.controls.usuario.setValue(empleado.usuario)
      this.formUser.controls.contrasena.setValue(empleado.contrasena)
      this.formUser.controls.enccompras.setValue((empleado.enccompras == 1) ? true : false)
      this.formUser.controls.vendedor.setValue((empleado.vendedor == 1) ? true : false)
      this.formUser.controls.administrador.setValue((empleado.administrador == 1) ? true : false )
      this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
    }
  }
  changeListener(evento:DropdownChangeEvent) {
    if (evento.value != null && evento.value.usuario != "Nuevo") {
      let body = {
        idEmp: evento.value.usuario
      }
      this.sql.alta(this.sql.URL + "/consulta/ConsEmpleado", body)
        .then((datosEmp) => {
          if(datosEmp!=undefined){
            this.option = (<empleado[]>datosEmp)[0]
            this.loadEm(this.option);
          }
        });
    } else {
      this.option = this.empleados[0]
      this.limpiarFormulario();
    }
  }

  registrarEmpleado() {
    let body = {
      usuario: this.formUser.controls.usuario.value,
      nombre: this.formUser.controls.nombre.value,
      contrasena: this.formUser.controls.contrasena.value,
      vendedor: (this.formUser.controls.vendedor.value ? true : false),
      enccompras: (this.formUser.controls.enccompras.value ? true : false),
      administrador: (this.formUser.controls.administrador.value ? true : false)
    }
    console.log(body)
    if (this.option.usuario == "Nuevo") {
      this.sql.alta(this.sql.URL + "/alta/Emp", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Registro', 'Se ha registrado correctamente el empleado', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Registro', 'Ha ocurrido un error al registrar el empleado, faltan datos ' + respuesta.err, 'error');
        }
      })
    } else {
      this.sql.alta(this.sql.URL + "/cambio/Prov", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Actualizar', 'Se ha actualizado correctamente el empleado', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Actualizar', 'Ha ocurrido un error al actualizar el empleado, faltan datos', 'error')
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
