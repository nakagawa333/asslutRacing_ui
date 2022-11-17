import { Component,Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators,ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../auth.service";
import * as constant from "../../constants"
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [CookieService]
})

export class SingupComponent{
    constructor(
        private authService: AuthService, 
        private router: Router
    ){}

    public signForm = new FormGroup({
        userName: new FormControl("",[
            Validators.required,
            Validators.maxLength(100)
        ]),
        mail: new FormControl("",[
            Validators.required,
            Validators.maxLength(100),
            Validators.email
        ]),
        password: new FormControl("",[
            Validators.required,
            Validators.maxLength(100),
            Validators.minLength(7)
        ]),
        reconfirmPassword: new FormControl("",[

        ])
    });

    //ユーザー名
    public userName = this.signForm.controls.userName

    //メール
    public mail = this.signForm.controls.mail

    //パスワード
    public password = this.signForm.controls.password
    
    //パスワード再入力
    public reconfirmPassword = this.signForm.controls.reconfirmPassword
    //
    public userErrorMessage = ""

    async submitSignUpForm(){
        if(this.signForm.invalid) return;

        //パスワードとパスワード再入力の値が異なる場合
        if(this.checkPassword()){
            return;
        }

        let body:Object = {
            "userName":this.signForm.get("userName")?.value,
            "mail":this.signForm.get("mail")?.value,
            "password":this.signForm.get("password")?.value,
            "requestUrl":location.origin
        }

        await this.authService.signup(body)
        .subscribe({
            next:(data:any) => {
                console.log(data)
            },
            error: (e:any) => {
                alert("サインアップ時にエラーが発生しました")
            }
        })
    }

    //パスワード再確認から離した場合
    reconfirmPasswordBlur(){
        this.checkPassword();
    }

    //ユーザー名から離した場合
    async userNameBlur(userName:String){
        await this.authService.selectUser(userName)
        .subscribe({
            next:(data:any) => {
                if(data === 1) {
                    this.signForm.controls.userName.setErrors({"existUserName":true})
                }
            },
            error:(e:any) => {

            }
        })
    }

    checkPassword():boolean{
        if(this.signForm.controls.password.value !== this.signForm.controls.reconfirmPassword.value){
            this.signForm.controls.reconfirmPassword.setErrors({"diffPassword":true});
            return false;
        }
        return true;
    }
}