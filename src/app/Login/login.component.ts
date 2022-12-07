import { Component,Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../auth.service";
import * as constant from "../../constants"
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [CookieService]
})

export class LoginComponent implements OnInit{

    constructor(
        private authService: AuthService, 
        private router: Router,
        private cookie: CookieService,
        private location: Location,
        ) {}

    public loginForm = new FormGroup({
        userName: new FormControl("",[
            Validators.required,
            Validators.maxLength(100)
        ]),
        password: new FormControl("",[
            Validators.required,
            Validators.maxLength(100)
        ]),
    });

    //ユーザー名
    public userName = this.loginForm.controls.userName

    //パスワード
    public password = this.loginForm.controls.password

    //ログイン状態保持フラグ
    private loginStateObserveFlg:boolean


    ngOnInit(){
        //既にログイン済の場合、url履歴を戻す
        if(this.authService.isLoggedIn.value){
            this.location.back();
        }
    }

    //ログイン状態を保持クリック時
    loginStateObserve(e:any){
        this.loginStateObserveFlg = e.target.checked;
    }

    async submitLoginForm(){
        if(this.loginForm.invalid) return;

        let userName = null;
        let mail = null;

        let mailRegex = new RegExp(constant.REGEX.MAIL);
        let val:string = this.loginForm.get("userName")?.value?.trim() || "";

        //メールアドレスの場合
        if(mailRegex.test(val)){
            mail = val
        } else if(val !== ""){
            userName = val
        }
        
        let body:Object = {
            "userName":userName,
            "mail":mail,
            "password":this.loginForm.get("password")?.value?.trim()
        }

        let cookie = this.cookie

        //ログインする
        await this.authService.login(body)
        .subscribe({
            next:(data:any) => {
                if(data !== null){
                    //ログイン状態を保持チェック状態がtrue
                    if(this.loginStateObserveFlg){
                        //ログイン情報を保持する(10日)
                        cookie.set(constant.COOKIE.USERID,data["userId"],10)
                        cookie.set(constant.COOKIE.USERNAME,data["userName"],10)
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
                    alert("ユーザー名orメールアドレス、もしくはパスワードが間違えています。")
                }
            },
            error: (e:any) => {
                alert("ログイン時にエラーが発生しました")
            }
        })
    }
}