import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearNVComponent } from './components/crear-nv/crear-nv.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { ConsultarNvComponent } from './components/consultar-nv/consultar-nv.component';
import { LoginComponent } from './components/login/login.component';
import { CrearNcComponent } from './components/crear-nc/crear-nc.component';
import { CrearProvComponent } from './components/crear-prov/crear-prov.component';
import { CrearEdComponent } from './components/crear-ed/crear-ed.component';
import { ConsultarNcComponent } from './components/consultar-nc/consultar-nc.component';
import { CrearAutorComponent } from './components/crear-autor/crear-autor.component';
import { CrearEmComponent } from './components/crear-em/crear-em.component';
import { RegClientesComponent } from './components/reg-clientes/reg-clientes.component';
import { ConsEncargoComponent } from './components/cons-encargo/cons-encargo.component';
import { ConsNotaApartadoComponent } from './components/cons-nota-apartado/cons-nota-apartado.component';
import { RegNeComponent } from './components/reg-ne/reg-ne.component';
import { RegNaComponent } from './components/reg-na/reg-na.component';

const routes: Routes = [
  { path: 'RegProd', component: RegistrarComponent },
  { path: 'RegClientes', component: RegClientesComponent },
  { path: 'RegNE', component: RegNeComponent },
  { path: 'RegNA', component: RegNaComponent },
  { path: 'CrearNV', component: CrearNVComponent },
  { path: 'ConsNV', component: ConsultarNvComponent },
  { path: 'CrearNC', component: CrearNcComponent},
  { path: 'CrearProv', component: CrearProvComponent},
  { path: 'ConsEncargo', component: ConsEncargoComponent },
  { path: 'ConsNA', component: ConsNotaApartadoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'RegEdit', component: CrearEdComponent},
  { path: 'ConsNC', component: ConsultarNcComponent},
  { path: 'RegAut', component: CrearAutorComponent},
  { path: 'RegEmp', component: CrearEmComponent},
  { path: '', component: InicioComponent },
  { path: '**', component: InicioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
