import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SQLService } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-nv',
  templateUrl: './consultar-nv.component.html',
  styleUrls: ['./consultar-nv.component.css']
})
export class ConsultarNvComponent implements OnInit {
  usuario:any = sessionStorage.getItem('usuario');
  NVs:infoNV[] = [];
  NVsfiltradas:infoNV[] = [];
  busqueda:string = "";
  termino!:HTMLInputElement;
  detalleNV!:any;

  constructor(private sql:SQLService){
    if(this.usuario) this.usuario = JSON.parse(this.usuario);
  }
  async ngOnInit(): Promise<void> {
    await this.consNV();
  }

  async consNV(){
    let consulta = await this.sql.consulta(this.sql.URL+"/consulta/ConsNV");
    let retornar:infoNV[] = [];
    consulta.forEach((nv: any)=>{
      console.log(nv)
      this.NVs = <infoNV[]>nv;
      this.initBusqueda();
    });
  }

  initBusqueda(){
    this.NVsfiltradas = this.NVs;
    this.termino = <HTMLInputElement> document.getElementById("termino")!;
    this.termino.addEventListener("keyup",() => {
      this.NVsfiltradas = [];
      if(this.termino!=undefined && this.termino.value!=""){
        this.busqueda = this.termino.value;
        this.NVs.forEach((nv:infoNV)=>{
          if(nv.folioNV.toString().includes(this.busqueda)){
            this.NVsfiltradas.push(nv);
          }
        });
      }else{
        this.busqueda = "";
        this.NVsfiltradas = this.NVs;
      }
    });
  }

  async mostrarDetalles(folio:number){
    let body = {
      idNV:folio
    }

    let vacio:detNV[] = [];
    this.detalleNV = await this.sql.alta(this.sql.URL+"/consulta/ConsDetalleNV",body).then((res)=>{
      let details = <detNV[]>res || vacio;
      let detalles:string = "";
      let subtotal:number = 0;
      let impuestosTotal:number = 0;
      let total:number = 0;
      details.forEach((detail:detNV)=>{
        subtotal += (detail.precioProducto*detail.cantidadProducto);
        impuestosTotal += (detail.impuesto*detail.cantidadProducto);
        detalles += `
              <tr>
                <td>$${detail.precioProducto}</td>
                <td> ${detail.cantidadProducto} </td>
                <td>$${detail.impuesto}</td>
                <td>  ${detail.productoISBN}</td>
              </tr>
        `
      });
      total = subtotal + impuestosTotal;
      total = parseFloat(total.toFixed(2));
      impuestosTotal = parseFloat(impuestosTotal.toFixed(2));
      subtotal = parseFloat(subtotal.toFixed(2));
      Swal.fire({
        title: '<strong>Detalles de la venta: '+folio+'</strong>',
        icon: 'info',
        html:
        `
        <table class="table table-light table-striped text-center">
            <thead></thead>
              <tr>
                <th>Precio del producto</th>
                <th>Cantidad del producto</th>
                <th>Impuesto</th>
                <th>ISBN del producto</th>
              </tr>
            </thead>
            <tbody *ngFor="let detail of details">
              ${detalles}
            </tbody>
          </table>
          <div class="row text-center" style="margin: 0;">
          <div class="col-4">
            Subtotal: $${subtotal}
          </div>
          <div class="col-4">
            Impuesto: $${impuestosTotal}
          </div>
          <div class="col-4">
            Total: $${total}
          </div>
          </div>
        `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText:
          'Cerrar',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        width:'80%',
      });
    });

  }
}
interface infoNV{
  clienteId_cte:number;
  fechaVenta:string;
  folioNV:number;
  nombre: String;
}
interface detNV{
  precioProducto:number,
  cantidadProducto:number,
  impuesto:number,
  productoISBN:string,
  notaVentaFolioNV:number,
  nombre: String
}
