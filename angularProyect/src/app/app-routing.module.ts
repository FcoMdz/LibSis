import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearNVComponent } from './components/crear-nv/crear-nv.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { ConsultarNvComponent } from './components/consultar-nv/consultar-nv.component';
import { LoginComponent } from './components/login/login.component';

const routes:Routes = [
  {path: 'RegProd', component: RegistrarComponent},
  {path: 'CrearNV', component: CrearNVComponent},
  {path: 'ConsNV', component: ConsultarNvComponent},
  {path: 'login', component: LoginComponent},
  {path: '', component: InicioComponent},
  {path: '**', component: InicioComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
