import { Injectable,OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../constants";
import { BehaviorSubject } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { ObserversModule } from "@angular/cdk/observers";


@Injectable({
    providedIn: 'root',
})

export class AuthService{
    //ログイン状態
    public isLoggedIn = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private cookie: CookieService){
            this.updateIsLoggedIn();
    }

    //ログイン
    login(body:object){
        let self = this;
        return self.http.post(constant.API.URL + constant.API.LOGIN,body)
    }

    //ログアウト
    logout(){
        let self = this;
        //セッションに保存しているユーザーIDとユーザー名を削除
        self.cookie.delete(constant.COOKIE.USERID,'/')
        self.cookie.delete(constant.COOKIE.USERNAME,'/')
        self.updateIsLoggedIn()
    }

    getUserId(){
        return this.cookie.get(constant.COOKIE.USERID)
    }

    //ログイン状態を更新
    updateIsLoggedIn(){
        let self = this;
        let userId = self.cookie.get(constant.COOKIE.USERID)
        self.isLoggedIn.next(userId !== "");
    }

    //ユーザー名から取得
    selectUserByUserName(userName:string){
        return this.http.post(constant.API.URL + constant.API.SELECTUSERBYUSERNAME,userName)
    }

    //メールから取得
    selectUserByMail(mail:string){
        return this.http.post(constant.API.URL + constant.API.SELECTUSERBYMAIL,mail)
    }

    //サインアップ
    signup(body:object){
        return this.http.post(constant.API.URL + constant.API.SIGNUP,body)
    }

    //トークン確認
    verifyToken(token:String | null){
        return this.http.post(constant.API.URL + constant.API.VERIFYTOKEN,token)
    }

    //パスワードリセットメール送信
    sendPasswordResetMail(body:object){
        return this.http.post(constant.API.URL + constant.API.PASSWORDRESET,body)
    }

    //パスワードアップデート
    passwordUpdate(body:object){
        return this.http.put(constant.API.URL + constant.API.PASSWORDUPDATE,body)
    }
}