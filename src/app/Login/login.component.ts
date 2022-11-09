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

    constructor(
        private authService: AuthService, 
        private router: Router,
        private cookie: CookieService
        ) {}

    ngOnInit(){

    }

    async submitForm(){
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
                    //ログイン情報を保持する
                    cookie.set(constant.COOKIE.USERID,data["userId"])
                    cookie.set(constant.COOKIE.USERNAME,data["userName"])

                    //初期画面に遷移
                    this.router.navigate(["/home"])
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