
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsAccountUserNameService } from './settings-account-username.service';
import { UpdateUsername } from '../updateUsername';
import { SnackBarService } from '../snackBar.service';
import { Router } from '@angular/router'
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import * as constant from "../../constants";
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  templateUrl: './settings-account-username.component.html',
  styleUrls: ['./settings-account-username.component.css']
})
export class SettingsAccountUserNameComponent implements OnInit{

  constructor(
    private authService:AuthService,
    private snackBarService:SnackBarService,
    private service:SettingsAccountUserNameService,
    private errorSnackBarService:ErrorSnackBarService,
    private cookie:CookieService,
    private router: Router
  ){}

  public settingsAccountUserNameForm = new FormGroup({
    userName:new FormControl("",[
      Validators.required,
      Validators.maxLength(100)
    ])
  })

  public userName = this.settingsAccountUserNameForm.controls.userName;

  ngOnInit(): void{
    let self = this;
  }

  //ユーザー名からカーソルを離した場合
  public userNameBlur(userName:any):void{
    if(!userName) return;
    let self = this;
    self.authService.selectUserByUserName(userName)
    .subscribe({
      next:(userNum:any) => {
        //入力したユーザー名が存在する場合
        if(1 <= userNum){
          self.settingsAccountUserNameForm.controls.userName.setErrors({"existUserName":true})
        }
      },
      error:(e:any) => {
        self.errorSnackBarService.openSnackBarForErrorMessage(["原因不明のエラーが発生しました"]);
      }
    })
  }

  //変更ボタンクリック時
  public changeUserNameButtonClick():void{
    let self = this;
    if(self.settingsAccountUserNameForm.invalid) return;
    let userId = self.authService.getUserId();
    let userName = self.userName.value !== null ? self.userName.value : ""

    if(userId === ""){
      self.errorSnackBarService.openSnackBarForErrorMessage(["不正なアクセスです。ログインしなおしてください。"]);
    }

    let updateUsername:UpdateUsername = {
      userId:Number(userId),
      userName:userName
    }

    //ユーザー名からユーザー情報取得
    self.authService.selectUserByUserName(userName)
    .subscribe({
      next:(userNum:any) => {
        //入力したユーザー名が存在する場合
        if(1 <= userNum){
          self.settingsAccountUserNameForm.controls.userName.setErrors({"existUserName":true})
        } else {
          //httpヘッダー
          let headers = self.authService.createHttpHeaders();
          //アクセストークンが存在しない場合
          if(headers === null){
            self.errorSnackBarService.openSnackBarForErrorMessage([constant.MESSAGE.UNAUTHORISEDACCESS]);
            return;
          }

          //ユーザー名更新処理
          self.service.updateUserName(updateUsername)
          .subscribe({
            next:(updateUserRes:any) => {
              if(updateUserRes["userUpdateSucessFlag"]){
                self.snackBarService.openSnackBar("ユーザー名の変更に成功しました");
                self.cookie.set(constant.COOKIE.ACESSTOKEN,updateUserRes["acessToken"]);
                self.cookie.set(constant.COOKIE.REFRESHTOKEN,updateUserRes["refreshToken"]);
                self.router.navigate([constant.PATH.SETTINGSACCOUNT]);
              } else {
                self.errorSnackBarService.openSnackBarForErrorMessage(["ユーザー名の変更に失敗しました"]);
              }
            },
            error:(error:any) => {
              self.errorSnackBarService.openSnackBar(error);
            }
          })
        }
      },
      error:(e:any) => {
        self.errorSnackBarService.openSnackBarForErrorMessage(["原因不明のエラーが発生しました"]);
      }
    })
  }
}