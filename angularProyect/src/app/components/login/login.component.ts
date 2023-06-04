
import { Component } from '@angular/core';
import { SQLService } from 'src/app/services/sql.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario!:string;
  contrasena!:string;
  constructor(private SqlService:SQLService){}
  login(){
    let body = {
      usuario: this.usuario,
      contrasena: this.contrasena
    }
    this.SqlService.alta('http://localhost:3000/login', body).then((data) =>{
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  }
}
