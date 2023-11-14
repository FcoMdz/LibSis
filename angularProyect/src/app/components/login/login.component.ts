
import { Component, EventEmitter, Output } from '@angular/core';
import { SQLService } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario!:string;
  contrasena!:string;
  loginEvent = new EventEmitter();
  constructor(private SqlService:SQLService, private router:Router){

  }
  login(){
    console.log(this.usuario + " - " + this.contrasena);
    let body = {
      usuario: this.usuario,
      contrasena: this.contrasena
    }
    this.SqlService.alta(this.SqlService.URL+'/login', body).then((data) =>{
      let respuesta = <usuario>data;
      if(respuesta.success == false){
        Swal.fire("Inicio de sesión",
                  "Error, no se ha encontrado al usuario o la contraseña es incorrecta",
                  'error')
        .then(() => {
          this.usuario = "";
          this.contrasena = "";
        });
      }else{
        sessionStorage.setItem('usuario',JSON.stringify(data));
        Swal.fire("Inicio de sesión", "Se ha iniciado correctamente",'success')
        .then(() => {
          this.loginEvent.emit();
          this.router.navigateByUrl('/');
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}

interface usuario{
  success: boolean;
  nombre: string;
  vendedor: boolean;
  almacenista: boolean;
  cajero: boolean;
  enccompras: boolean;
  administrador: boolean;
}
