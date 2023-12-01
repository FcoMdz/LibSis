import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SQLService {
  public URL:string = "http://localhost:3000"
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
  id: string;
  err: string;
  code: string;
}
