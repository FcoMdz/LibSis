import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [SQLService],
  bootstrap: [AppComponent]
})
export class AppModule { }
