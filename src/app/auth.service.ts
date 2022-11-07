import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../constants"

@Injectable({
    providedIn: 'root'
})

export class AuthService{
    constructor(private http: HttpClient){

    }

    login(body:object){
        return this.http.post(constant.API.URL + constant.API.AUTH_USER,body)
    }
}