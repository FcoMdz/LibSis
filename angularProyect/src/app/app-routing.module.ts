import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearNVComponent } from './components/crear-nv/crear-nv.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { ConsultarNvComponent } from './components/consultar-nv/consultar-nv.component';
import { LoginComponent } from './components/login/login.component';
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
  { path: 'ConsEncargo', component: ConsEncargoComponent },
  { path: 'ConsNA', component: ConsNotaApartadoComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: InicioComponent },
  { path: '**', component: InicioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
