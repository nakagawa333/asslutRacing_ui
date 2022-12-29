import { Component,Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import {AuthService} from "../auth.service";
import * as constant from "../../constants"
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MessageModalComponent} from "src/app/messageModal/message-modal.component";
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import {SnackBarConfig} from '../union/snabar';
import { LoginBody } from '../interface/loginBody';

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
        private dialog: MatDialog,
        private snackBar: MatSnackBar
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

    //snackBarを開くための設定値
    private loginSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        duration:SnackBarConfig?.duration
    }

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

    submitLoginForm(){
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

        let body:LoginBody = {
            "userName":userName,
            "mail":mail,
            "password":this.loginForm.get("password")?.value?.trim()
        }

        let cookie = this.cookie

        //ログインする
        this.authService.login(body)
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

                    //snackBarを開く
                    let loginSnackBar:MatSnackBarRef<any> = this.snackBar.open("ログインしました。","",this.loginSnackConfig);

                } else {
                    //snackBarを開く
                    let loginFailSnackBar:MatSnackBarRef<any> = this.snackBar.open("ユーザー名orメールアドレス、もしくはパスワードが間違えています。","",this.loginSnackConfig);
                }
            },
            error: (e:any) => {
                let loginSnackBar:MatSnackBarRef<any> = this.snackBar.open("ログイン時にエラーが発生しました","",this.loginSnackConfig);
            }
        })
    }

    private openDialog(component:any,param:object):any{
        return this.dialog.open(component,param)
    }
}