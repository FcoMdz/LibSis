import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { CrearNVComponent } from './crear-nv/crear-nv.component';
import { InicioComponent } from './inicio/inicio.component';
import { ConsultarNvComponent } from './consultar-nv/consultar-nv.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrarComponent,
    CrearNVComponent,
    InicioComponent,
    ConsultarNvComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
