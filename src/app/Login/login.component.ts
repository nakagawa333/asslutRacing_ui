import { Component,Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../auth.service";
import { MatFormFieldModule } from '@angular/material/form-field';
import * as constant from "../../constants"

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent{
    public loginForm = new FormGroup({
        userName: new FormControl("",Validators.required),
        password: new FormControl("",Validators.required),
    });

    constructor(private authService: AuthService, private router: Router) {}

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
                    sessionStorage.setItem(constant.LOCALSTORAGE.LOGIN,JSON.stringify(data));
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