import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SQLService {
  public URL:string = "https://libsistest-production.up.railway.app"
  constructor(private httpClient:HttpClient) { }
  async consulta(url:string){
    return this.httpClient.get(url);
  }
  async alta(url:string,body:any){
    return this.httpClient.post(url,body).toPromise();
  }
}

export interface res{
  success: boolean;
  err: string;
}
