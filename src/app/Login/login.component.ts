import { Component,Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../auth.service";
import * as constant from "../../constants"
import { CookieService } from 'ngx-cookie-service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [CookieService]
})


export class LoginComponent implements OnInit{
    public loginForm = new FormGroup({
        userName: new FormControl("",Validators.required),
        password: new FormControl("",Validators.required),
    });

    //ログイン状態保持フラグ
    private loginStateObserveFlg:boolean

    constructor(
        private authService: AuthService, 
        private router: Router,
        private cookie: CookieService,
        ) {}

    ngOnInit(){

    }

    //ログイン状態を保持クリック時
    loginStateObserve(e:any){
        this.loginStateObserveFlg = e.target.checked;
    }

    async submitLoginForm(){
        if(this.loginForm.invalid) return;

        let body:Object = {
            "userName":this.loginForm.get("userName")?.value,
            "password":this.loginForm.get("password")?.value
        }

        let cookie = this.cookie

        //ログインする
        await this.authService.login(body)
        .subscribe({
            next:(data:any) => {
                if(data !== null){
                    //ログイン状態を保持チェック状態がtrue
                    if(this.loginStateObserveFlg){
                        //ログイン情報を保持する(無期限)
                        cookie.set(constant.COOKIE.USERID,data["userId"])
                        cookie.set(constant.COOKIE.USERNAME,data["userName"])
                    } else {
                        //ログイン情報を保持する(1日)
                        cookie.set(constant.COOKIE.USERID,data["userId"],1)
                        cookie.set(constant.COOKIE.USERNAME,data["userName"],1)                    
                    }

                    //ログイン状態を更新
                    this.authService.updateIsLoggedIn();

                    //初期画面に遷移
                    this.router.navigate(["/home"])

                    alert("ログインに成功しました")
                } else {
                    alert("ログイン認証に失敗しました")
                }
            },
            error: (e:any) => {
                alert("ログイン時にエラーが発生しました")
            }
        })
    }
}