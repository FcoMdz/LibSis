import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Subscription } from 'rxjs';
import { Accessibility } from 'accessibility/dist/main';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'LibSis';
  usuario!:any;

  subscription!:Subscription;

  constructor(private router:Router){
    this.usuario = sessionStorage.getItem('usuario');
  }

  ngOnInit(): void {
    this.initUserManage();
    this.initAccessibility();
  }

  initAccessibility(){
    var opt = new Accessibility({
      language: {
        textToSpeechLang: 'es-MX',
        speechToTextLang: 'es-MX'
      },
      labels:{
        resetTitle: 'Reiniciar',
        closeTitle: 'Cerrar',
        menuTitle: 'Accesibilidad',
        increaseText: 'Aumentar tamaño de letra',
        decreaseText: 'Disminuir tamaño de letra',
        increaseTextSpacing: 'Aumentar espaciado horizontal',
        decreaseTextSpacing: 'Disinuir espaciado horizontal',
        increaseLineHeight: 'Aumentar espaciado vertical',
        decreaseLineHeight: 'Disminuir espaciado vertical',
        invertColors: 'Invertir colores',
        grayHues: 'Escala de Grises',
        underlineLinks: 'Subrayar links',
        bigCursor: ' Cursor más grande',
        readingGuide: 'Guía de lectura',
        textToSpeech:'Texto al habla',
        speechToText: 'Dictado de texto',
        disableAnimations: 'Desabilitar animaciones',
        screenReader: 'Lector de pantalla'
      }
    });
  }

  initUserManage():void{
    let btnRegistro = document.getElementById("inicioSesion");
    let btnCerrar = document.getElementById("cerrarSesion");
    this.usuario = sessionStorage.getItem('usuario');
    if(this.usuario && btnRegistro && btnCerrar){
      this.usuario = JSON.parse(this.usuario);
      btnRegistro.innerHTML = "Bienvenido, " + this.usuario.nombre;
      btnRegistro.setAttribute("disabled", "true");
      btnCerrar.removeAttribute("disabled");
    }else if(btnRegistro && btnCerrar){
      btnRegistro.innerHTML = '<i class="fa-solid fa-user"></i> Iniciar Sesión';
      btnRegistro.removeAttribute("disabled");
      btnCerrar.setAttribute("disabled", "true");
    }
  }

  cerrarSesion(){
    sessionStorage.removeItem('usuario');
    this.initUserManage();
  }

  suscribeToEmmiter(componentRef:Component){
    if(!(componentRef instanceof LoginComponent)){
      return;
    }
    const child:LoginComponent = componentRef;
    child.loginEvent.subscribe(()=>{
      this.initUserManage();
    });
  }

  unsuscribe(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
