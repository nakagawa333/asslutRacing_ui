import { Component,Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../auth.service";
import * as constant from "../../constants"
// import { CookieService } from 'ngx-cookie-service';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
    public loginForm = new FormGroup({
        userName: new FormControl("",Validators.required),
        password: new FormControl("",Validators.required),
    });

    constructor(
        private authService: AuthService, 
        private router: Router
        ) {}

    ngOnInit(){

    }

    async submitForm(){
        if(this.loginForm.invalid) return;

        let body:Object = {
            "userName":this.loginForm.get("userName")?.value,
            "password":this.loginForm.get("password")?.value
        }

        //ログインする
        await this.authService.login(body)
        .subscribe({
            next:(data:any) => {
                if(data !== null){
                    //ログイン情報を保持する
                    // sessionStorage.setItem(constant.LOCALSTORAGE.LOGIN,JSON.stringify(data));
                    // this.cookieService.set("userId",data["userId"])
                    // this.cookieService.set("userName",data["userName"])
                    // this.cookieService.set("password",data["password"])

                    //初期画面に遷移
                    this.router.navigate(["/home"])
                }
            },
            error: (e:any) => {
                console.log(e)
            }
        })
    }
}