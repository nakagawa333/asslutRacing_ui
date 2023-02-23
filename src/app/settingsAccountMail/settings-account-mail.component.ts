
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateUsername } from '../updateUsername';
import { SnackBarService } from '../snackBar.service';
import { Router } from '@angular/router'
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import { SettingsAccountMailService } from './settings-account-mailservice';
import { UpdateMail } from '../updateMail';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResponseService } from '../http-error-response.service';


@Component({
  templateUrl: './settings-account-mail.component.html',
  styleUrls: ['./settings-account-mail.component.css']
})
export class SettingsAccountMailComponent implements OnInit{

  constructor(
    private authService:AuthService,
    private service:SettingsAccountMailService,
    private errorSnackBarService:ErrorSnackBarService,
    private httpErrorResponseService:HttpErrorResponseService,
    private snackBarService:SnackBarService,
    private router: Router
  ){}

  public settingsAccountMailForm = new FormGroup({
    mail:new FormControl("",[
      Validators.required,
      Validators.maxLength(100),
      Validators.email
    ])
  })

  public mail= this.settingsAccountMailForm.controls.mail;

  ngOnInit(): void{
    let self = this;
  }

  //メールからカーソルを離した場合
  public mailBlur(mail:string):void{
    if(!mail) return;
    let self = this;
    self.authService.selectUserByMail(mail.trim())
    .subscribe({
      next:(userNum:any) => {
        //入力したメールが存在する場合
        if(1 <= userNum){
          self.settingsAccountMailForm.controls.mail.setErrors({"existMail":true})
        }
      },
      error:(e:HttpErrorResponse) => {
        //エラーレスポンスからエラーメッセージリストを作成
        let errorMessageList:string[] = self.httpErrorResponseService.createErrorMessageList(e);
        self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      }
    })
  }

  //変更ボタンクリック時
  public changeMailButtonClick():void{
    let self = this;
    if(self.settingsAccountMailForm.invalid) return;
    let userId = self.authService.getUserId();
    let mail = self.mail.value !== null ? self.mail.value.trim() : ""

    if(userId === ""){
      self.errorSnackBarService.openSnackBarForErrorMessage(["不正なアクセスです。ログインしなおしてください。"]);
    }

    let updateMail:UpdateMail = {
      userId:Number(userId),
      mail:mail,
      requestUrl:location.origin
    }

    //メールからユーザー情報取得
    self.authService.selectUserByMail(mail)
    .subscribe({
      next:(userNum:any) => {
        //入力したメールが存在する場合
        if(1 <= userNum){
          self.settingsAccountMailForm.controls.mail.setErrors({"existMail":true})
        } else {
          //メール更新用メール送信
          self.service.sendMailUpdateMail(updateMail)
          .subscribe({
            next:(res:any) => {
              let message:string = res["mail"] + "にメールを送信しましたので、ご確認をお願いします。有効期限は24時間です。";
              self.snackBarService.openSnackBar(message);
            },
            error:(e:HttpErrorResponse) => {
              //エラーレスポンスからエラーメッセージリストを作成
              let errorMessageList:string[] = self.httpErrorResponseService.createErrorMessageList(e);
              //エラーメッセージリストのスナックバーを表示
              self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
            }
          })
        }
      },
      error:(e:HttpErrorResponse) => {
        //エラーレスポンスからエラーメッセージリストを作成
        let errorMessageList:string[] = self.httpErrorResponseService.createErrorMessageList(e);
        //エラーメッセージリストのスナックバーを表示
        self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      }
    })
  }
}