import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../constants";
import { BehaviorSubject, Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { ObserversModule } from "@angular/cdk/observers";
import { Router } from "@angular/router";
import {environment} from "../environments/environment";
import { LoginBody } from "./interface/loginBody";
import { Buffer } from 'buffer'


@Injectable({
    providedIn: 'root',
})

export class AuthService {
    //ログイン状態
    public isLoggedIn = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private cookie: CookieService,
        private router: Router
        ) {
        this.updateIsLoggedIn();
    }

    //ログイン
    login(body: LoginBody) :Observable<Object>{
        let self = this;
        let userName = body.userName === null ? "" : body.userName;
        let passsword = body.password === undefined ? "" : body.password;
        return self.http.post(environment.apiUrl + constant.API.LOGIN, body)
    }

    //ログアウト
    logout() :void{
        let self = this;
        //セッションに保存しているユーザーIDとユーザー名を削除
        self.cookie.deleteAll('/')
        //ログイン状態を更新
        self.updateIsLoggedIn()
        //ログイン画面に繊維
        self.router.navigate([constant.PATH.LOGIN])
    }

    //ユーザーidを取得する
    getUserId() {
        return this.cookie.get(constant.COOKIE.USERID)
    }

    //アクセストークンを取得する
    getAccessToken():string{
        return this.cookie.get(constant.COOKIE.ACESSTOKEN);
    }

    //リフレッシュトークンを取得する
    getRefreshToken():string{
        return this.cookie.get(constant.COOKIE.REFRESHTOKEN);
    }

    //jwt用のhttpヘッダーを作成する
    createHttpHeaders():HttpHeaders | null{
        //アクセストークン
        let acessToken = this.getAccessToken();

        //アクセストークンが存在しない場合
        if(acessToken === null) {
            return null;
        }

        let headers = new HttpHeaders({
            "Authorization":"Basic " + acessToken
        })
        return headers;
    }

    //ログイン状態を更新
    updateIsLoggedIn(): void {
        let self = this;
        let isUserId = self.cookie.check(constant.COOKIE.USERID)
        let isUsername = self.cookie.check(constant.COOKIE.USERNAME)
        self.isLoggedIn.next(isUserId && isUsername);
    }

    //ログイン状態を確認
    checkIsLoggedIn(): boolean {
        let self = this;
        self.updateIsLoggedIn();
        return self.isLoggedIn.getValue();
    }

    //ログイン状態でない場合、ログインページに遷移
    isBackLoginPage():void{
        let self = this;
        //ログイン状態
        let isLoggedIn = self.checkIsLoggedIn();
        //エラーメッセージを表示
        if(!isLoggedIn){
            self.router.navigate([constant.PATH.LOGIN]);
        }
    }

    /**
     * 
     * @param refreshToken リフレッシュトークン
     * @returns 
     */
    refreshToken(body:object){
        return this.http.post(environment.apiUrl + constant.API.REFRESHTOKEN,body);
    }

    //ユーザー名から取得
    selectUserByUserName(userName: string) {
        return this.http.post(environment.apiUrl + constant.API.SELECTUSERBYUSERNAME, userName)
    }

    //メールから取得
    selectUserByMail(mail: string) {
        return this.http.post(environment.apiUrl + constant.API.SELECTUSERBYMAIL, mail)
    }

    //サインアップ
    signup(body: object) {
        return this.http.post(environment.apiUrl + constant.API.SIGNUP, body)
    }

    //トークン確認
    verifyToken(token: String | null) {
        return this.http.post(environment.apiUrl + constant.API.VERIFYTOKEN, token)
    }

    //パスワードリセットメール送信
    sendPasswordResetMail(body: object) {
        return this.http.post(environment.apiUrl + constant.API.PASSWORDRESET, body)
    }

    //パスワードアップデート
    passwordUpdate(body: object) {
        return this.http.put(environment.apiUrl + constant.API.PASSWORDUPDATE, body)
    }
}