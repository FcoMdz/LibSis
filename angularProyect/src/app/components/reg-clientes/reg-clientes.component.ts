import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MultiSelectChangeEvent } from 'primeng/multiselect';
import { SQLService, res } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reg-clientes',
  templateUrl: './reg-clientes.component.html',
  styleUrls: ['./reg-clientes.component.css'],
})
export class RegClientesComponent implements OnInit{
  usuario: any = sessionStorage.getItem('usuario');
  clientes: cliente[] = []
  btnReg!: HTMLButtonElement;
  optionCte!:cliente|null;
  constructor(private sql: SQLService){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }
  async ngOnInit(): Promise<void> {
    await this.getClientes()
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
  }
  formGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(15),
    ]),
  });

  async getClientes(){
    (await this.sql.consulta(this.sql.URL+"/consulta/consCte")).forEach((cliente) => {
      this.clientes = <cliente[]>cliente
      this.clientes.splice(0, 0, <cliente>{
        id_cte: 0,
        Nombre: "Nuevo cliente",
        Telefono: ''
      })
    })
  }


  changeListener(evento:MultiSelectChangeEvent){
    if (evento.value != null && evento.value.id_cte != 0) {
      let body = {
        idCte: evento.value.id_cte
      }
      this.sql.alta(this.sql.URL + "/consulta/consCte", body)
        .then((datosCte:any) => {
          if(datosCte!=undefined){
            this.optionCte = <cliente>datosCte[0]
            this.loadCte(<cliente>datosCte[0])
          }
        });
    } else {
      this.limpiarFormulario()
      this.optionCte = this.clientes[0];
    }
  }

  loadCte(dataCte: cliente){
    this.formGroup.controls.nombre.setValue(dataCte.Nombre)
    this.formGroup.controls.telefono.setValue(dataCte.Telefono)
    this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
  }

  limpiarFormulario() {
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>'
    this.formGroup.reset()
    this.btnReg.disabled = true
  }

  subirCliente(){
    let body = {
      idCte: this.optionCte?.id_cte,
      nombre: this.formGroup.controls.nombre.value,
      telefono: this.formGroup.controls.telefono.value?.toString(),
    }
    if(this.optionCte == null){
      Swal.fire(
        'Registro',
        'Debe seleccionar un usuario para relaizar el registro o actualización',
        'info'
      );
    }else if (this.optionCte.id_cte == 0) {
      this.sql.alta(this.sql.URL + "/alta/Cte", body).then((resp) => {
        let respuesta = <res>resp;
        if (respuesta.success) {
          Swal.fire(
            'Registro',
            'Se ha registrado correctamente el cliente',
            'success'
          );
          this.limpiarFormulario();
          this.getClientes();
        } else {
          Swal.fire(
            'Registro',
            'Ha ocurrido un error al registrar el cliente, faltan datos ',
            'error'
          );
        }
      });
    } else {
      this.sql.alta(this.sql.URL + "/cambio/Cte", body).then((res) => {
        let respuesta = <res>res;
        if (respuesta.success) {
          Swal.fire(
            'Actualizar',
            'Se ha actualizado correctamente el cliente',
            'success'
          );
          this.limpiarFormulario();
          this.getClientes();
        } else {
          Swal.fire(
            'Actualizar',
            'Ha ocurrido un error al actualizar el cliente, faltan datos',
            'error'
          );
        }
      });
    }
  }
}

interface cliente {
  id_cte: Number
  Nombre: string
  Telefono: string
}
