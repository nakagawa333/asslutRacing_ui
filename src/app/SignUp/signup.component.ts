import { Component,Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators,ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../auth.service";
import * as constant from "../../constants"
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { User } from 'src/user';
import {SnackBarConfig} from '../union/snabar';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [CookieService]
})

export class SingupComponent{
    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar:MatSnackBar
    ){}

    private user: User |undefined;

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
    public userErrorMessage:String;

    //snackBarを開くための設定値
    private signUpSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        duration:SnackBarConfig?.duration
    }

    async submitSignUpForm(){
        if(this.signForm.invalid) return;

        let body:Object = {
            "userName":this.signForm.get("userName")?.value?.trim(),
            "mail":this.signForm.get("mail")?.value?.trim(),
            "password":this.signForm.get("password")?.value?.trim(),
            "requestUrl":location.origin
        }

        await this.authService.signup(body)
        .subscribe({
            next:(data:any) => {
                console.log(data)
            },
            error: (e:any) => {
                this.snackBar.open("サインアップ時にエラーが発生しました","",this.signUpSnackConfig);
            }
        })
    }

    //パスワード再確認から離した場合
    reconfirmPasswordBlur(){
        this.checkPassword();
    }

    //ユーザー名から離した場合
    async userNameBlur(userName:String){
        let body = {
            "userName":userName,
            "password":null,
            "mail":null
        }

        await this.authService.selectUser(body)
        .subscribe({
            next:(data:any) => {
                if(data === 1) {
                    this.signForm.controls.userName.setErrors({"existUserName":true})
                }
            },
            error:(e:any) => {
                this.snackBar.open(e?.statusText,"",this.signUpSnackConfig);
            }
        })
    }

    async mailBlur(mail:String | null){
        let body = {
            "userName":null,
            "password":null,
            "mail":mail
        }
        await this.authService.selectUser(body)
        .subscribe({
            next:(data:any) => {
                if(data === 1) {
                    this.signForm.controls.mail.setErrors({"existMail":true})
                }
            },
            error:(e:any) => {
                this.snackBar.open(e?.statusText,"",this.signUpSnackConfig);
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