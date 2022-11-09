import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../constants";
import { BehaviorSubject } from "rxjs";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
    providedIn: 'root',
})

export class AuthService{
    private isLoggedIn = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private cookie: CookieService){
            let userId = this.cookie.get(constant.COOKIE.USERID)
            this.isLoggedIn.next(userId !== "");
    }

    getIsLoggedIn(){
        return this.isLoggedIn.value;
    }

    login(body:object){
        return this.http.post(constant.API.URL + constant.API.AUTH_USER,body)
    }

    getUserId(){
        return this.cookie.get(constant.COOKIE.USERID)
    }
}