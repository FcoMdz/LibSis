import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-crear-nv',
  templateUrl: './crear-nv.component.html',
  styleUrls: ['./crear-nv.component.css']
})
export class CrearNVComponent implements OnInit {
  usuario: any = sessionStorage.getItem('usuario');
  productos: any;
  options!: HTMLSelectElement;
  cliente!: HTMLSelectElement;
  cantidad!: number;
  clientes!: any;
  precio!: HTMLSelectElement;
  cantidadMax!: number;
  Cte!: number;
  impuesto!: HTMLSelectElement;
  campos: venderProducto[] = [];
  campo: venderProducto = new venderProducto();
  total: number = 0;
  subtotal: number = 0;
  impuestosTotal: number = 0;
  existencias: number = 0;

  formUser = new FormGroup({
    'cantidad': new FormControl('', Validators.pattern('^[0-9]*$'))
  });


  constructor(private sql: SQLService) {
    if (this.usuario) this.usuario = JSON.parse(this.usuario);

  }
  async ngOnInit(): Promise<void> {
    await this.consProductos();
    await this.consClientes();
    this.options = <HTMLSelectElement>document.getElementById("options")!;
    this.precio = <HTMLSelectElement>document.getElementById("precio")!;
    this.impuesto = <HTMLSelectElement>document.getElementById("impuesto")!;
    this.cliente = <HTMLSelectElement>document.getElementById("clientes")!;
    this.initListeners();
  }

  async consClientes() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consCte");
    consulta.forEach((cte) => {
      this.clientes = cte;
    });
  }

  async consProductos() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consProds")
    consulta.forEach((producto) => {
      this.productos = producto;
    });
  }

  initListeners() {
    this.options.addEventListener('change', (event) => {
      if (this.options.value != "0") {
        let body = {
          ISBN: this.options.value
        }
        this.sql.alta(this.sql.URL + "/consProd", body)
          .then((datosProducto) => {
            let producto = <datosProducto>datosProducto;
            let resultado = producto.producto;
            if (resultado) {
              this.existencias = resultado.existencias;
              this.precio.value = resultado.precio.toFixed(2);
              this.cantidadMax = parseInt(resultado.existencias.toString());
              this.impuesto.value = resultado.impuesto.toString();
              this.campo.ISBN = resultado.ISBN;
              this.campo.impuesto = (resultado.precio - (resultado.precio / (1 + (resultado.impuesto / 100)))).toFixed(2);
              this.campo.precio = (resultado.precio / (1 + (resultado.impuesto / 100))).toFixed(2);
              this.campo.nombre = resultado.nombre.toString();
            }
          });
      } else {
        this.limpiarCampos();
      }
    })
  }

  limpiarCampos() {
    this.existencias = 0;
    this.options.selectedIndex = 0;
    this.cantidad = 0;
    this.precio.value = "";
    this.cantidadMax = 0;
    this.impuesto.value = "";
    this.campo.ISBN = "";
    this.campo.impuesto = "";
    this.campo.precio = "";
    this.campo.nombre = "";
  }

  cargarNV() {
    this.clientes.forEach((element: any) => {
      if (element.id_cte == this.cliente.options[this.cliente.selectedIndex].value) {
        this.Cte = element.id_cte;
      }
    });
    let ISBNS: { ISBN: string, cant: string }[] = [];
    this.campos.forEach(element => {
      ISBNS.push({
        ISBN: element.ISBN,
        cant: element.cantidad
      });
    });
    let body = {
      idCte: this.Cte,
      ISBNProds: ISBNS
    }
    if (!this.Cte || this.Cte == 0) {
      Swal.fire('Registro', 'Debe seleccionar un cliente para realizar la nota de venta', 'info');
      return;
    }
    if (this.campos.length <= 0) {
      Swal.fire('Registro', 'Debe agregar productos para registrar la nota de venta', 'info');
      return;
    }
    this.sql.alta(this.sql.URL + "/CrearNV", body)
      .then((res) => {
        let resultado = <res>res;
        if (!resultado.success) {
          Swal.fire('Regisrar', 'Error al reigstrar la nota de venta: ' + resultado.err, 'error');
          return;
        }
        Swal.fire('Registrar', 'Se ha registrado correctamente la nota de venta con Folio: ' + resultado.err, 'success').then(() => {
          this.cliente.selectedIndex = 0;
          this.limpiarCampos();
          this.campos = [];
          this.actualizarTotales();

        });
      });
    this.consProductos();
  }

  reducir(producto: venderProducto) {
    producto.cantidad = (parseInt(producto.cantidad) - 1).toString();
    if (parseInt(producto.cantidad) == 0) {
      this.campos.splice(this.campos.indexOf(producto), 1)
    }
    this.actualizarTotales();
  }

  agregarProducto() {
    if (this.campo) {
      if (!this.campo.ISBN) {
        Swal.fire('Agregar', 'Debe seleccionar un producto para agregar', 'info');
        return;
      }
      if (!this.cantidad || this.cantidad == 0) {
        Swal.fire('Agregar', 'Debe ingresar una cantidad para agregar', 'info');
        return;
      }
      this.campo.cantidad = this.cantidad.toString();
      this.productos.forEach((producto: any) => {
        if (producto.ISBN != this.campo.ISBN) return;
        if (producto.existencias < parseInt(this.campo.cantidad)) {
          Swal.fire('Agregar', 'Las existencias del producto son menores a la cantidad seleccionada, existencias actuales: ' + producto.existencias, 'error');
          return;
        }
        for (let i = 0; i < this.campos.length; i++) {
          const element = this.campos[i];
          if (element.ISBN == producto.ISBN) {
            if ((parseInt(this.campo.cantidad) + parseInt(element.cantidad)) <= producto.existencias) {
              element.cantidad = (parseInt(this.campo.cantidad) + parseInt(element.cantidad)).toString();
              this.actualizarTotales();
              return;
            } else {
              Swal.fire('Agregar', 'Las existencias del producto son menores a la cantidad seleccionada con los elementos ya agregados, existencias actuales: ' + producto.existencias, 'error');
              return;
            }
          }
        }
        this.campos.push(new venderProducto(this.campo));
        this.actualizarTotales();
        return;
      });

    }
  }

  actualizarTotales() {
    this.total = 0;
    this.impuestosTotal = 0;
    this.subtotal = 0;
    this.campos.forEach((campo) => {
      this.subtotal += (parseFloat(campo.precio) * parseFloat(campo.cantidad));
      this.impuestosTotal += parseFloat(campo.impuesto) * parseFloat(campo.cantidad);
    });
    this.total = this.subtotal + this.impuestosTotal;
    this.total = parseFloat(this.total.toFixed(2));
    this.impuestosTotal = parseFloat(this.impuestosTotal.toFixed(2));
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
  }
}


interface datosProducto {
  producto: producto;
  autores: any[];
  editoriales: any[];
}
interface producto {
  success: boolean;
  ISBN: string;
  nombre: string;
  precio: number;
  existencias: number;
  impuesto: number;
}

interface ventaCte {
  Id_cte: string;
  nombre_cte: string;
}
class venderProducto {
  ISBN: string = '';
  nombre: string = '';
  precio: string = '';
  cantidad: string = '';
  impuesto: string = '';
  constructor(venderProducto?: venderProducto) {
    if (venderProducto) {
      this.ISBN = venderProducto.ISBN;
      this.nombre = venderProducto.nombre;
      this.precio = venderProducto.precio;
      this.cantidad = venderProducto.cantidad;
      this.impuesto = venderProducto.impuesto;
    }
  }
}