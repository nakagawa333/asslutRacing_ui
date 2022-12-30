import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as constant from "../../constants";


@Injectable({
    providedIn: 'root'
  })
export class TopService{
    constructor(
        private http: HttpClient,
      ){}

    //お知らせ通知一覧を取得
    public getNotifications():Observable<Object>{
        const httpOptions:Object = {
            headers: new HttpHeaders({
              'Content-Type':'application/json'
            })
        }
        return this.http.get(constant.API.URL + constant.API.SELECTNOTIFICATION,httpOptions)
    }
}