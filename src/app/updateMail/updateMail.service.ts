import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../../constants';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

/**
 * メール更新
 */
export class UpdateMailService{
  constructor(
    private http: HttpClient,
  ){}

  updateMail(token:string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    return this.http.put(environment.apiUrl + constant.API.UPDATEMAIL,token,httpOptions);
  }
}