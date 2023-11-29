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
import { CrearNcComponent } from './components/crear-nc/crear-nc.component';
import { CrearProvComponent } from './components/crear-prov/crear-prov.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CrearEdComponent } from './components/crear-ed/crear-ed.component';
import { ConsultarNcComponent } from './components/consultar-nc/consultar-nc.component';
import { CrearEmComponent } from './components/crear-em/crear-em.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrarComponent,
    CrearNVComponent,
    InicioComponent,
    ConsultarNvComponent,
    LoginComponent,
    CrearNcComponent,
    CrearProvComponent,
    CrearEdComponent,
    ConsultarNcComponent,
    CrearEmComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule
  ],
  providers: [SQLService],
  bootstrap: [AppComponent]
})
export class AppModule { }
