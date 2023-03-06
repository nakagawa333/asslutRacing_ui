
import { Component, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../snackBar.service';
import { Router } from '@angular/router'
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResponseService } from '../http-error-response.service';
import { SettingsAccountPasswordService } from './settings-account-password.service';
import * as constant from "../../constants"
import { BlockScrollStrategy } from '@angular/cdk/overlay';


@Component({
  templateUrl: './settings-account-password.component.html',
  styleUrls: ['./settings-account-password.component.css']
})

//パスワード情報設定コンポーネントクラス
export class SettingsAccountPasswordComponent implements OnInit{

  constructor(
    private authService:AuthService,
    private service:SettingsAccountPasswordService,
    private errorSnackBarService:ErrorSnackBarService,
    private httpErrorResponseService:HttpErrorResponseService,
    private snackBarService:SnackBarService,
    private router: Router
  ){}

  public settingsAccountPasswordForm = new FormGroup({
    password:new FormControl("",[
      Validators.required,
      Validators.maxLength(100),
    ]),
    newPassword:new FormControl("",[
      Validators.required,
      Validators.maxLength(100),
    ]),
    reenterNewPassword:new FormControl("",[
      Validators.required,
      Validators.maxLength(100),
    ])
  })

  //新しいパスワード
  public newPassword:FormControl<string | null> = this.settingsAccountPasswordForm.controls.newPassword;
  
  //パスワード
  public password:FormControl<string | null> = this.settingsAccountPasswordForm.controls.password;

  //新しいパスワードの再入力
  public reenterNewPassword:FormControl<string | null> = this.settingsAccountPasswordForm.controls.reenterNewPassword;

  //新しいパスワード表示フラグ
  public newPasswordVisibleFlag:boolean = true;

  //パスワード表示フラグ
  public passwordVisibleFlag:boolean = true;

  //新しいパスワードの再入力表示フラグ
  public reenterNewPasswordVisibleFlag:boolean = true;

  ngOnInit(): void{
    let self = this;
  }

  //パスワードからカーソルを離した場合
  public passwordBlur(password:string):void{
    if(!password) return;
    let self = this;

    //ログイン状態でない場合
    if(!self.authService.isLoggedIn){
      let errorMessageList:string[] = [];
      errorMessageList.push(constant.MESSAGE.UNAUTHORISEDACCESS);
      self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      return;
    }

    let userId = Number(self.authService.getUserId());
    self.service.selectUserByPassword(password.trim(),userId)
    .subscribe({
      next:(isvValidityPasswordFlag:any) => {
        //入力したパスワードが間違っている場合
        if(!isvValidityPasswordFlag){
          self.settingsAccountPasswordForm.controls.password.setErrors({"noPassword":true})
        }
      },
      error:(e:HttpErrorResponse) => {
        //エラーレスポンスからエラーメッセージリストを作成
        let errorMessageList:string[] = self.httpErrorResponseService.createErrorMessageList(e);
        self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      }
    })
  }

  //新しいパスワードからカーソルを離した場合
  public newPasswordBlur(newPassword:string):void{
    if(!newPassword) return;
    let self = this;

    //ログイン状態でない場合
    if(!self.authService.isLoggedIn){
      let errorMessageList:string[] = [];
      errorMessageList.push(constant.MESSAGE.UNAUTHORISEDACCESS);
      self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      return;
    }
    
    let userId = Number(self.authService.getUserId());

    self.service.selectUserByPassword(newPassword.trim(),userId)
    .subscribe({
      next:(isvValidityPasswordFlag:any) => {
        //入力したパスワードが既に使用されている場合
        if(isvValidityPasswordFlag){
          self.settingsAccountPasswordForm.controls.newPassword.setErrors({"alreadyUsedPassword":true})
        }
      },
      error:(e:HttpErrorResponse) => {
        //エラーレスポンスからエラーメッセージリストを作成
        let errorMessageList:string[] = self.httpErrorResponseService.createErrorMessageList(e);
        self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      }
    })
  }

  //新しいパスワードからカーソルを離した場合
  public reenterNewPasswordBlur(reenterNewPassword:string):void{
    if(!reenterNewPassword) return;
    let self = this;

    //新しいパスワードと
    if(self.newPassword.value !== self.reenterNewPassword.value){
      self.settingsAccountPasswordForm.controls.reenterNewPassword.setErrors({"notSameNewPassword":true})
    }
  }
  
  /**
   * パスワード更新ボタンクリック
   * @returns 
   */
  public changePasswordButtonClick():void{
    let self = this;
    if(self.settingsAccountPasswordForm.invalid) return;

    //ログイン状態でない場合
    if(!self.authService.isLoggedIn){
      let errorMessageList:string[] = [];
      errorMessageList.push("不正なアクセスです。ログインしなおしてください。");
      self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      return;
    }

    let userId = self.authService.getUserId();
    let newPassword = self.newPassword.value !== null ? self.newPassword.value.trim() : ""

  }
}