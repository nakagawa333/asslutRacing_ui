
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { SettingsAccountService } from './settings-account.service';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.css']
})
export class SettingsAccountComponent implements OnInit{

  constructor(
    private service:SettingsAccountService,
    private authService:AuthService,
    private errorSnackBarService:ErrorSnackBarService
  ){}

  //ユーザー名
  public userName:string = "";

  //アスタリスク化したパスワード
  public asteriskPassword:string = "";

  //メール
  public mail:string = "";

  ngOnInit(): void{
    let self = this;
    //ユーザーの設定情報を取得する
    self.getSettingsAccount();
  }

  /**
   * ユーザーidを元にユーザーの設定情報を取得する
   */
  getSettingsAccount():void{
    let self = this;
    let userId = self.authService.getUserId();
    //ユーザーの設定情報を取得する
    self.service.getSettingsAccount(userId)
    .subscribe({
      next:(datas:any) => {
        if(datas !== null){
          self.userName = datas["userName"];
          self.asteriskPassword = "*".repeat(8);
          self.mail = datas["mail"];
        } else {
          self.errorSnackBarService.openSnackBarForErrorMessage(["アカウント情報が見つかりませんでした。"]);
        }
      },
      error:(error:any) => {
        self.errorSnackBarService.openSnackBar(error);
      }
    })

  }
}