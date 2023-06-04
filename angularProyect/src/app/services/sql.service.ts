import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SQLService {
  public URL:string = "http://localhost:3000"
  constructor(private httpClient:HttpClient) { }
  consulta(url:string){
    return this.httpClient.get(url);
  }
  alta(url:string,body:any){
    return this.httpClient.post(url,body).toPromise();
  }
}
