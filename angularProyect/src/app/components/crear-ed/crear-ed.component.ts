import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import Swal from 'sweetalert2';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-crear-ed',
  templateUrl: './crear-ed.component.html',
  styleUrls: ['./crear-ed.component.css']
})
export class CrearEdComponent implements OnInit{
  usuario: any = sessionStorage.getItem('usuario');
  btnReg!: HTMLButtonElement;
  editoriales!: any;
  option!:editorial;
  formUser = new FormGroup({
    'nombre': new FormControl('', [Validators.required]),
    'telefono': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$'),Validators.maxLength(10)])
  })
  constructor(private sql: SQLService){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
      await this.getData();
      this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
  }

  async getData() {
    await this.consEditoriales();
  }
  changeListener(evento:DropdownChangeEvent) {
    if (evento.value != null && evento.value.id_editorial != "0") {
      let body = {
        idEdit: evento.value.id_editorial
      }
      this.sql.alta(this.sql.URL + "/consulta/ConsEditorial", body)
        .then((datosEdit) => {
          if(datosEdit!=undefined){
            this.option = (<editorial[]>datosEdit)[0]
            this.loadEd(datosEdit);
          }
        });
    } else {
      this.option = this.editoriales[0]
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.formUser.reset()
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    this.btnReg.disabled = true;
  }

  loadEd(datosEd: any ){
      let datos = <editorial>datosEd[0];
      let editorial = datos;
      if(editorial){
        this.btnReg.disabled = false;
        this.formUser.controls.nombre.setValue(editorial.nombre);
        this.formUser.controls.telefono.setValue(editorial.telefono);
        this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
      }
  }

  async consEditoriales(){
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consEditoriales")
    consulta.forEach((editorial:any) => {
      this.editoriales = editorial;
      this.editoriales.splice(0, 0, <editorial>{
        nombre: "Nueva editorial",
        telefono: "",
        id_editorial: "0"
      })
    })
  }
  registrarEd(){
    let body = {
      idEdit: this.option.id_editorial,
      nombre: this.formUser.controls.nombre.value,
      telefono: this.formUser.controls.telefono.value?.toString()
    }
    if (this.option.id_editorial == "0") {
      this.sql.alta(this.sql.URL + "/alta/Edit", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Registro', 'Se ha registrado correctamente la editorial', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Registro', 'Ha ocurrido un error al registrar la editorial, faltan datos ' + respuesta.err, 'error');
        }
      })
    } else {
      this.sql.alta(this.sql.URL + "/cambio/Edit", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire('Actualizar', 'Se ha actualizado correctamente la editorial', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Actualizar', 'Ha ocurrido un error al actualizar la editorial, faltan datos', 'error')
        }

      });
    }
  }

}

interface editorial {
  id_editorial: string;
  nombre: string;
  telefono: string;
}