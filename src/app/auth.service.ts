import { Injectable,OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../constants";
import { BehaviorSubject } from "rxjs";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
    providedIn: 'root',
})

export class AuthService{
    public isLoggedIn = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private cookie: CookieService){
            this.updateIsLoggedIn();
    }

    login(body:object){
        return this.http.post(constant.API.URL + constant.API.LOGIN,body)
    }

    logout(){
        //セッションに保存しているユーザーIDとユーザー名を削除
        this.cookie.delete(constant.COOKIE.USERID)
        this.cookie.delete(constant.COOKIE.USERNAME)
        this.updateIsLoggedIn()
    }

    getUserId(){
        return this.cookie.get(constant.COOKIE.USERID)
    }

    //ログイン状態を更新
    updateIsLoggedIn(){
        let userId = this.cookie.get(constant.COOKIE.USERID)
        this.isLoggedIn.next(userId !== "");       
    }

    signup(body:object){
        return this.http.post(constant.API.URL + constant.API.SIGNUP,body)
    }
}