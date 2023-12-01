import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-reg-na',
  templateUrl: './reg-na.component.html',
  styleUrls: ['./reg-na.component.css']
})
export class RegNaComponent {
  minDate: Date = new Date(); //Variable de control de fecha, se usa en <p-calendar> para poner la fecha minima (siempre es el dia de hoy).
  usuario: any = sessionStorage.getItem('usuario');
  constructor(){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  formGroup = new FormGroup({
    cliente: new FormControl('', [Validators.required]),
    producto: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    abono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]+)?$')]),
    cantidad: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    fecha_limite: new FormControl('', [Validators.required])
  });

  countries = [ //
    { name: 'Australia', value: 'AU' },
    { name: 'Brazil', value: 'BR' },
    { name: 'China', value: 'CN' },
    { name: 'Egypt', value: 'EG' },
    { name: 'France', value: 'FR' },
    { name: 'Germany', value: 'DE' },
    { name: 'India', value: 'IN' },
    { name: 'Japan', value: 'JP' },
    { name: 'Spain', value: 'ES' },
    { name: 'United States', value: 'US' },
  ];

  estado_apartado = [
    { name: 'Apartado Iniciado', value: 'ai' },
    { name: 'Apartado Entregado', value: 'ae' },
  ]
}
