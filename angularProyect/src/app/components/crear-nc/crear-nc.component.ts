import { Component, OnInit } from '@angular/core';
import { SQLService, res } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';
import { DropdownChangeEvent } from "primeng/dropdown"
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
  selector: 'app-crear-nc',
  templateUrl: './crear-nc.component.html',
  styleUrls: ['./crear-nc.component.css']
})
export class CrearNcComponent implements OnInit {
  usuario: any = sessionStorage.getItem('usuario');
  productos: any;
  cantidad!: number;
  Proveedores!: any;
  campos: venderProducto[] = [];
  campo: venderProducto = new venderProducto();
  total: number = 0;
  subtotal: number = 0;
  impuestosTotal: number = 0;
  proveedores!:any;
  optionProv!:proveedor|null
  optionProd!:producto|null
  formUser = new FormGroup({
    'precio': new FormControl('', [Validators.pattern('^[0-9]{0,5}(.[0-9]{2})?$')]),
    'impuesto': new FormControl('', [Validators.pattern('^[0-9]{1,2}$')]),
    'cantidad': new FormControl('', Validators.pattern('^[0-9]*$'))
  });

  constructor(private sql: SQLService) {
    if (this.usuario) this.usuario = JSON.parse(this.usuario);

  }
  async ngOnInit(): Promise<void> {
    await this.consProductos();
    await this.consProveedores();
  }

  changeListenerProv(evento:DropdownChangeEvent) {
    if (evento.value != null && evento.value.id_proveedor != "0") {
      let body = {
        idProv: evento.value.id_proveedor
      }
      this.sql.alta(this.sql.URL + "/consulta/ConsProv", body)
        .then((datosProv) => {
          if(datosProv!=undefined){
            this.optionProv = (<proveedor[]>datosProv)[0]
          }
        });
    } else {
      this.optionProv = null;
    }
  }

  changeListenerProd(evento:DropdownChangeEvent) {
    if (evento.value != null && evento.value.ISBN != "0") {
      let body = {
        ISBN: evento.value.ISBN
      }
      this.sql.alta(this.sql.URL + "/consulta/consProd", body)
        .then((datosProd:any) => {
          if(datosProd!=undefined){
            this.optionProd = <producto>datosProd.producto
          }
        });
    } else {
      this.optionProd = null;
    }
  }

  async consProveedores() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consProveedores")
    consulta.forEach((proveedor:any) => {
      this.proveedores = proveedor;
    });
  }

  async consProductos() {
    let consulta = await this.sql.consulta(this.sql.URL + "/consulta/consProds")
    consulta.forEach((producto) => {
      this.productos = producto;
    });
  }

  limpiarCampos() {
    this.formUser.reset()
  }

  cargarNC() {
    let ISBNS: { ISBN: string, cant: string, costo:String, impuesto:String }[] = [];
    this.campos.forEach(element => {
      ISBNS.push({
        ISBN: element.ISBN,
        cant: element.cantidad,
        costo: element.precio,
        impuesto: element.impuesto
      });
    });
    if (!this.optionProv || this.optionProv.id_proveedor == "0") {
      Swal.fire('Registro', 'Debe seleccionar un proveedor para realizar la nota de compra', 'info');
      return;
    }
    if (this.campos.length <= 0) {
      Swal.fire('Registro', 'Debe agregar productos para registrar la nota de compra', 'info');
      return;
    }
    let body = {
      idProv: this.optionProv.id_proveedor,
      ISBNProds: JSON.stringify(ISBNS)
    }
    this.sql.alta(this.sql.URL + "/alta/NC", body)
      .then((res) => {
        let resultado = <res>res;
        if (!resultado.success) {
          Swal.fire('Regisrar', 'Error al reigstrar la nota de compra: ' + resultado.err, 'error');
          return;
        }
        Swal.fire('Registrar', 'Se ha registrado correctamente la nota de compra con Folio: ' + resultado.id, 'success').then(() => {
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

  deshabilitarPrv():boolean{
    if(this.campos.length > 0) return true
    return false
  }

  agregarProducto() {
    if (this.formUser.valid) {
      if (!this.optionProv?.RFC) {
        Swal.fire('Agregar', 'Debe seleccionar un proveedor para agregar productos', 'info');
        return;
      }
      if (!this.optionProd?.ISBN) {
        Swal.fire('Agregar', 'Debe seleccionar un producto para agregar', 'info');
        return;
      }
      if (!this.formUser.controls.cantidad.value || !this.formUser.controls.precio.value || !this.formUser.controls.impuesto.value) {
        Swal.fire('Agregar', 'Debe ingresar los campos para poder agragar', 'info');
        return;
      }
      this.campo.ISBN = this.optionProd?.ISBN
      this.campo.cantidad = this.formUser.controls.cantidad.value!
      this.campo.nombre = this.optionProd?.nombre
      this.campo.precio = (parseFloat(this.formUser.controls.precio.value!) / (1 + parseInt(this.formUser.controls.impuesto.value!)*.01)).toFixed(2).toString()
      this.campo.impuesto = (parseFloat(this.formUser.controls.precio.value!) - parseFloat(this.campo.precio)).toFixed(2).toString()

      if(this.campos.length != 0){
        var flag:boolean = true;
        this.campos.forEach((producto: venderProducto) => {
          if (producto.ISBN != this.campo.ISBN) return;
          if (producto.impuesto == this.campo.impuesto && producto.precio == this.campo.precio){
            this.campos[this.campos.indexOf(producto)].cantidad = 
            (parseInt(this.campos[this.campos.indexOf(producto)].cantidad) +
            parseInt(this.campo.cantidad)).toString();
            flag = false;
          }
          return;
        });
        if(flag){
          this.campos.push(new venderProducto(this.campo));
          flag = false;
        }
      }else{
        this.campos.push(new venderProducto(this.campo));
      }
      this.actualizarTotales();
      
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



interface proveedor {
  nombre: string;
  telefono: string;
  RFC: string;
  id_proveedor: string;
}