import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { SQLService } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-autor',
  templateUrl: './crear-autor.component.html',
  styleUrls: ['./crear-autor.component.css']
})
export class CrearAutorComponent {
  usuario: any = sessionStorage.getItem('usuario');
  btnReg!: HTMLButtonElement;
  btnElm!: HTMLButtonElement;
  autores!:any;
  option!:autor

  formUser = new FormGroup({
    'nombre': new FormControl('', [Validators.required]),
  });

  constructor(private sql: SQLService) {
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.btnReg = <HTMLButtonElement>document.getElementById("btnReg")!;
  }

  async getData() {
    await this.consautores();
  }

  limpiarFormulario() {
    this.formUser.reset()
    this.btnReg.innerHTML = '<i class="fa-solid fa-book"></i> Registrar <i class="fa-solid fa-book"></i>';
    this.btnReg.disabled = true;
  }

  loadProv(datosProv: any) {
    let datos = <autor>datosProv[0];
    let prov = datos;
    if (prov) {
      this.btnReg.disabled = false;
      this.formUser.controls.nombre.setValue(prov.nombre)
      this.btnReg.innerHTML = '<i class="fa-solid fa-pencil"></i> Actualizar <i class="fa-solid fa-pencil"></i>';
    }
  }

  changeListener(evento:DropdownChangeEvent) {
    if (evento.value != null && evento.value.id_autor != "0") {
      let body = {
        idAutor: evento.value.id_autor
      }
      this.sql.alta(this.sql.URL + "/consulta/ConsAutor", body)
        .then((datosProv) => {
          if(datosProv!=undefined){
            this.option = (<autor[]>datosProv)[0]
            this.loadProv(datosProv);
          }
        });
    } else {
      this.option = this.autores[0]
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

  async consautores() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/ConsAutores")
    consulta.forEach((autor:any) => {
      console.log(autor)
      this.autores = autor;
      this.autores.splice(0, 0, <autor>{
        nombre: "Nuevo autor",
        id_autor: "0"
      })
    });
  }


  registrarAutor() {
    let body = {
      idAutor: this.option.id_autor,
      nombre: this.formUser.controls.nombre.value,
    }
    console.log(body)
    if (this.option.id_autor == "0") {
      this.sql.alta(this.sql.URL + "/alta/Autor", body).then((res:any) => {
        let respuesta = res;
        if (respuesta.success) {
          Swal.fire('Registro', 'Se ha registrado correctamente el autor', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Registro', 'Ha ocurrido un error al registrar el autor, faltan datos ' + respuesta.err, 'error');
        }
      })
    } else {
      this.sql.alta(this.sql.URL + "/cambio/Autor", body).then((res:any) => {
        let respuesta = res;
        if (respuesta.success) {
          Swal.fire('Actualizar', 'Se ha actualizado correctamente el autor', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Actualizar', 'Ha ocurrido un error al actualizar el autor, faltan datos', 'error')
        }

      });
    }
  }
  eliminarProv(){
    let body = {
      idProv: this.option.id_autor
    }
      this.sql.alta(this.sql.URL + "/baja/Prov",body).then((res:any) => {
        let respuesta = res;
        if (respuesta.success) {
          Swal.fire('Eliminado', 'Se ha eliminado correctamente el autor', 'success');
          this.limpiarFormulario();
          this.getData();
        } else {
          Swal.fire('Eliminado', 'Ha ocurrido un error al eliminar el autor' + respuesta.err, 'error');
        }
      })
    
    }
  }


interface autor {
  nombre: string;
  id_autor: string;
}