
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { ErrorService } from 'src/app/error.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsAccountUserNameService } from './settings-account-username.service';
import { UpdateUsername } from '../updateUsername';
import { SnackBarService } from '../snackBar.service';

@Component({
  templateUrl: './settings-account-username.component.html',
  styleUrls: ['./settings-account-username.component.css']
})
export class SettingsAccountUserNameComponent implements OnInit{

  constructor(
    private authService:AuthService,
    private errorService:ErrorService,
    private snackBarService:SnackBarService,
    private service:SettingsAccountUserNameService
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
        self.errorService.openSnackBarForErrorMessage("原因不明のエラーが発生しました");
      }
    })
  }

  //変更ボタンクリック時
  public changeUserNameButtonClick():void{
    let self = this;
    if(self.settingsAccountUserNameForm.invalid) return;
    let userId = self.authService.getUserId();
    let userName = self.userName.value !== null ? self.userName.value : ""

    let updateUsername:UpdateUsername = {
      userId:Number(userId),
      userName:userName
    }

    self.service.updateUserName(updateUsername)
    .subscribe({
      next:(userUpdateSucessFlag:any) => {
        if(userUpdateSucessFlag){
          self.snackBarService.openSnackBar("ユーザー名の変更に成功しました");
        } else {

        }
      },
      error:(error:any) => {

      }
    })
  }
}