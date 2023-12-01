import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { CrearNVComponent } from './components/crear-nv/crear-nv.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ConsultarNvComponent } from './components/consultar-nv/consultar-nv.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SQLService } from './services/sql.service';
import { RegClientesComponent } from './components/reg-clientes/reg-clientes.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ConsEncargoComponent } from './components/cons-encargo/cons-encargo.component';
import { ConsNotaApartadoComponent } from './components/cons-nota-apartado/cons-nota-apartado.component';
import { RegNeComponent } from './components/reg-ne/reg-ne.component';
import { RegNaComponent } from './components/reg-na/reg-na.component';
import { CalendarModule } from 'primeng/calendar';
import { CrearNcComponent } from './components/crear-nc/crear-nc.component';
import { CrearProvComponent } from './components/crear-prov/crear-prov.component';
import { CrearEdComponent } from './components/crear-ed/crear-ed.component';
import { ConsultarNcComponent } from './components/consultar-nc/consultar-nc.component';
import { CrearEmComponent } from './components/crear-em/crear-em.component';
import { CrearAutorComponent } from './components/crear-autor/crear-autor.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrarComponent,
    CrearNVComponent,
    InicioComponent,
    ConsultarNvComponent,
    LoginComponent,
    RegClientesComponent,
    ConsEncargoComponent,
    ConsNotaApartadoComponent,
    RegNeComponent,
    RegNaComponent,    CrearNcComponent,
    CrearProvComponent,
    CrearEdComponent,
    ConsultarNcComponent,
    CrearEmComponent,
    CrearAutorComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MultiSelectModule,
    DropdownModule,
    BrowserAnimationsModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule
  ],
  providers: [SQLService],
  bootstrap: [AppComponent],
})
export class AppModule { }
