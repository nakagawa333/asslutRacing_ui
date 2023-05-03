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
import { SnackBarService } from '../snackBar.service';
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OverlayService } from '../overlay.service';
import { LoadingSpinnerComponent } from '../loadingSpinner/loading-spinner.component';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [CookieService]
})

export class LoginComponent implements OnInit{

    constructor(
        private authService: AuthService,
        private snackBarService:SnackBarService,
        private router: Router,
        private cookie: CookieService,
        private location: Location,
        private dialog: MatDialog,
        private errorSnackBarService: ErrorSnackBarService,
        private overlayService:OverlayService,
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
        if(this.authService.checkIsLoggedIn()){
            this.location.back();
        }
    }

    //ログイン状態を保持クリック時
    loginStateObserve(e:any){
        this.loginStateObserveFlg = e.target.checked;
    }

    submitLoginForm(){
        let self = this;
        if(self.loginForm.invalid) return;

        let userName = null;
        let mail = null;

        let mailRegex = new RegExp(constant.REGEX.MAIL);
        let val:string = self.loginForm.get("userName")?.value?.trim() || "";

        //メールアドレスの場合
        if(mailRegex.test(val)){
            mail = val
        } else if(val !== ""){
            userName = val
        }

        let body:LoginBody = {
            "userName":userName,
            "mail":mail,
            "password":self.loginForm.get("password")?.value?.trim()
        }

        let cookie = self.cookie

        //ローディングスピナーを開く
        this.overlayService.attach(LoadingSpinnerComponent);
        //ログインする
        this.authService.login(body)
        .subscribe({
            next:(data:any) => {
                if(data !== null){
                    //セッションに保存しているユーザーIDとユーザー名を削除
                    cookie.deleteAll('/')

                    // localStorage.setItem("loginStateObserveFlg",this.loginStateObserveFlg)

                    //ログイン状態を保持チェック状態がtrue
                    if(this.loginStateObserveFlg){
                        //ログイン情報を保持する
                        cookie.set(constant.COOKIE.USERID,data["userId"],constant.COOKIE.EXPIREDYEAR,constant.COOKIE.PATH)
                        cookie.set(constant.COOKIE.USERNAME,data["userName"],constant.COOKIE.EXPIREDYEAR,constant.COOKIE.PATH)
                        cookie.set(constant.COOKIE.ACESSTOKEN,data["acessToken"],constant.COOKIE.EXPIREDYEAR,constant.COOKIE.PATH);
                        cookie.set(constant.COOKIE.REFRESHTOKEN,data["refreshToken"],constant.COOKIE.EXPIREDYEAR,constant.COOKIE.PATH);

                    } else {
                        //ログイン情報を保持する(1日)
                        cookie.set(constant.COOKIE.USERID,data["userId"],constant.COOKIE.EXPIREDDAY,constant.COOKIE.PATH)
                        cookie.set(constant.COOKIE.USERNAME,data["userName"],constant.COOKIE.EXPIREDDAY,constant.COOKIE.PATH)
                        cookie.set(constant.COOKIE.ACESSTOKEN,data["acessToken"],constant.COOKIE.EXPIREDDAY,constant.COOKIE.PATH);
                        cookie.set(constant.COOKIE.REFRESHTOKEN,data["refreshToken"],constant.COOKIE.EXPIREDDAY,constant.COOKIE.PATH);
                    }

                    //ログイン状態を更新
                    this.authService.updateIsLoggedIn();

                    //初期画面に遷移
                    this.router.navigate([constant.PATH.HOME]);

                    //snackBarを開く
                    this.snackBarService.openSnackBar(constant.MESSAGE.LOGINSUCESS);

                } else {
                    //snackBarを開く
                    self.errorSnackBarService.openSnackBarForErrorMessage([constant.MESSAGE.UNKNOWNERROR]);
                }
            },

            error: (e:HttpErrorResponse) => {
                self.errorSnackBarService.openSnackBarForErrorMessage([e.error.message])
            },
            
            complete: () => {
                //ローディングスピナーを閉じる
                this.overlayService.detach();
            }
        })
    }

    private openDialog(component:any,param:object):any{
        return this.dialog.open(component,param)
    }

    //「パスワードをお忘れの方」クリック時
    public passwordForgetClick():void{
        this.router.navigate([constant.PATH.PASSWORDRESET])
    }

    //サインアップクリック時
    public signUpClick():void{
        this.router.navigate([constant.PATH.SIGNUP])
    }
}