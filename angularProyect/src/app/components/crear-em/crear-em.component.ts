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
    'ventas': new FormControl('',[Validators.required]),
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
      if(empleado.enccompras == 1){
        this.formUser.controls.rol.setValue(empleado.enccompras)
      }
      
      this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
      this.btnElm.disabled = false;
    }
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