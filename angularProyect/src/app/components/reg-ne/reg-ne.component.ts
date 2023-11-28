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

  formGroup = new FormGroup({
    cliente: new FormControl('', [Validators.required]),
    producto: new FormControl('', [Validators.required]),
    abono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]+)?$')]),
    cantidad: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });

  countries = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
  ];
}
