import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { CrearNVComponent } from './crear-nv/crear-nv.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { ConsultarNvComponent } from './consultar-nv/consultar-nv.component';

const routes:Routes = [
  {path: 'RegProd', component: RegistrarComponent},
  {path: 'CrearNV', component: CrearNVComponent},
  {path: 'ConsNV', component: ConsultarNvComponent},
  {path: '', component: InicioComponent},
  {path: '**', component: InicioComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
