
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { SettingsAccountService } from './settings-account.service';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { ErrorService } from 'src/error.service';


@Component({
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.css']
})
export class SettingsAccountComponent implements OnInit{

  constructor(
    private service:SettingsAccountService,
    private authService:AuthService,
    private errorService:ErrorService
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
    let options:Object = {
      "responseType":"json"
    }

    //ユーザーの設定情報を取得する
    self.service.getSettingsAccount(userId,options)
    .subscribe({
      next:(datas:any) => {
        if(datas !== null){
          self.userName = datas["userName"];
          self.asteriskPassword = "*".repeat(datas["passwordLetters"] !== null ? datas["passwordLetters"] : 0);
          self.mail = datas["mail"];
        } else {
          self.errorService.openSnackBarForErrorMessage("アカウント情報が見つかりませんでした。");
        }
      },
      error:(error:any) => {
        self.errorService.openSnackBar(error);
      }
    })

  }
}