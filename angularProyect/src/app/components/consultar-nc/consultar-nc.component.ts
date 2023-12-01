import { Component, OnInit } from '@angular/core';
import { SQLService } from 'src/app/services/sql.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-nc',
  templateUrl: './consultar-nc.component.html',
  styleUrls: ['./consultar-nc.component.css']
})
export class ConsultarNcComponent implements OnInit{
  usuario:any = sessionStorage.getItem('usuario');
  Ncs:infoNC[] = [];
  NCsfiltradas:infoNC[] = [];
  busqueda: string = "";
  termino!:HTMLInputElement;
  detalleNC!:any;

  constructor(private sql:SQLService){
    if(this.usuario) this.usuario = JSON.parse(this.usuario);
  }
  async ngOnInit(): Promise<void> {
      await this.consNC();
  }

  async consNC(){
    let consulta = await this.sql.consulta(this.sql.URL+"/consulta/consNC");
    let retornar:infoNC[] = [];
    consulta.forEach((nc: any) => {
      this.Ncs = <infoNC[]>nc;
      console.log(this.Ncs)
      this.initBusqueda();
    })
  }

  initBusqueda(){
    this.NCsfiltradas = this.Ncs;
    this.termino = <HTMLInputElement> document.getElementById("termino")!;
    this.termino.addEventListener("keyup",() => {
      this.NCsfiltradas = [];
      if(this.termino!=undefined && this.termino.value!=""){
        this.busqueda = this.termino.value;
        this.Ncs.forEach((nc:infoNC)=>{
          if(nc.FolioNC.toString().includes(this.busqueda)){
            this.NCsfiltradas.push(nc);
          }
        });
      }else{
        this.busqueda = "";
        this.NCsfiltradas = this.Ncs;
      }
    });
  }

  async mostrarDetalles(folio:number){
    let body = {
      idNC:folio
    }
    let vacio:detNC[]=[];
    this.detalleNC = await this.sql.alta(this.sql.URL+"/consulta/consDetalleNC",body).then((res)=>{
      let details = <detNC[]>res || vacio;
      let detalles:string = "";
      let subtotal:number = 0;
      let impuestosTotal:number = 0;
      let total:number = 0;
      console.log(details)
      details.forEach((detail:detNC)=>{
        subtotal += (detail.precioProducto*detail.cantidadProducto);
        impuestosTotal += (detail.impuesto*detail.cantidadProducto);
        detalles += `
              <tr>
                <td>${detail.productoISBN}</td>
                <td>${detail.nombre}</td>
                <td>$${detail.precioProducto}</td>
                <td> ${detail.cantidadProducto} </td>
                <td>$${detail.impuesto}</td>
              </tr>
        `
      });
      total = subtotal + impuestosTotal;
      total = parseFloat(total.toFixed(2));
      impuestosTotal = parseFloat(impuestosTotal.toFixed(2));
      subtotal = parseFloat(subtotal.toFixed(2));
      Swal.fire({
        title: '<strong>Detalles de la compra: '+folio+'</strong>',
        icon: 'info',
        html:
        `
        <table class="table table-light table-striped text-center">
            <thead></thead>
              <tr>
                <th>ISBN del producto</th>
                <th>Producto</th>
                <th>Precio del producto</th>
                <th>Cantidad del producto</th>
                <th>Impuesto</th>
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

    eliminarNC(elemento: infoNC){
      Swal.fire({
        title: '<strong>Eliminar nota de compra ' + elemento.FolioNC + '</strong>',
        icon: 'question',
        html: `¿De verdad se desea eliminar la nota de compra?`,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText:`Cancelar`
      }).then((result) => {
        if(result.isConfirmed){
          let body = {
            folioNC: elemento.FolioNC.toString()
          }
          this.sql.alta(this.sql.URL + '/baja/NC', body).then((sqlRes:any) => {
            let resp = sqlRes
            if(resp.success){
              Swal.fire({
                title: '<strong>Eliminar nota de compra ' + elemento.FolioNC + '</strong>',
                icon: 'success',
                html: `Se ha eliminado correctamente la nota de compra`,
              })
              this.ngOnInit()
            }else{
              let errores = ""
              if(resp.err.code == "ER_CHECK_CONSTRAINT_VIOLATED"){
                errores += "No se pudo eliminar, debido a que los productos ya han sido vendidos<br>"
              }
              Swal.fire({
                title: '<strong>Eliminar nota de compra ' + elemento.FolioNC + '</strong>',
                icon: 'error',
                html: `Hubo un error al eliminar la nota de compra. ${errores}`,
              })
            }
          })
          
        }
      })
    }
}

interface infoNC{
  FolioNC: number;
  Fecha: Date;
  proveedorId_proveedor: number;
  nombre: string;
}
interface detNC{
  productoISBN: string;
  cantidadProducto: number;
  precioProducto: number;
  impuesto: number;
  notaCompraFolioNC: number;
  nombre: string;
}