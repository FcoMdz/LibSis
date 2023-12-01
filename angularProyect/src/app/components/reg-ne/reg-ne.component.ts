import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reg-ne',
  templateUrl: './reg-ne.component.html',
  styleUrls: ['./reg-ne.component.css'],
})
export class RegNeComponent {
  usuario: any = sessionStorage.getItem('usuario');

  constructor(){
    if (this.usuario) this.usuario = JSON.parse(this.usuario);
  }

  formGroup = new FormGroup({
    cliente: new FormControl('', [Validators.required]),
    producto: new FormControl('', [Validators.required]),
    abono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]+)?$')]),
    cantidad: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });

  countries = [
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

  estado_encargo = [
    { name: 'Encargo Iniciado', value: 'ei' },
    { name: 'Encargo en Camino', value: 'ec' },
    { name: 'Encargo Recibido', value: 'er' },
    { name: 'Encargo Entregado', value: 'ee' },
  ]
}
