import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reg-clientes',
  templateUrl: './reg-clientes.component.html',
  styleUrls: ['./reg-clientes.component.css'],
})
export class RegClientesComponent {
  usuario: any = sessionStorage.getItem('usuario');

  formGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(15),
    ]),
  });
}
