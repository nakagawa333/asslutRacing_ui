import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as constant from "../constants";
import { LogoutConfirmModalComponent } from './logoutConfirmModal/logout-confirm-modal.component';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Logout} from './interface/logout';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import { NotFoundErrorComponent } from './notFoundError/not-found-error.component';
import {MatButtonToggle} from '@angular/material/button-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{

  constructor(
    private router: Router,
    public authService: AuthService,
    private dialog: MatDialog,
    private lo: Location
  ) {

    //アプリ内にあるパス一覧
    let notApplicablePathNames:Set<string> = new Set([constant.PATH.HOME,constant.PATH.LOGIN,
      constant.PATH.SIGNUP,constant.PATH.VERIFY,constant.PATH.PASSWORDRESET,constant.PATH.VERIFYMAIL,
      constant.PATH.TOP,constant.PATH.SETTINGSACCOUNT]);

    let isLoggedAuthPaths:Set<String> = new Set([constant.PATH.LOGIN,constant.PATH.SIGNUP,constant.PATH.PASSWORDRESET,
      constant.PATH.VERIFY,constant.PATH.VERIFYMAIL,constant.PATH.TOP]);

    //ログイン状態を更新
    this.authService.updateIsLoggedIn();

    if(notApplicablePathNames.has(location.pathname)){
      //ログイン認証されていない場合
      if(!this.authService.isLoggedIn.value && !isLoggedAuthPaths.has(location.pathname)){
        //ログイン画面に遷移
        this.router.navigate([constant.PATH.LOGIN])
      } else if(this.authService.isLoggedIn.value && isLoggedAuthPaths.has(location.pathname)){
        //ログイン認証されている場合
        this.router.navigate([constant.PATH.HOME])
      }
    }
  }
  
  public positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public position = new FormControl(this.positionOptions[0]);

  //ログアウトアイコンクリック時
  public logoutClick():void{
    this.logoutConfilmOpenDialog();
  }


  private logoutConfilmOpenDialog():void{
    const param:object = {
      data:{"title":"ログアウトしてもよろしいでしょうか？"},
      id:"logout-confilm-modal"
    }
    const dialogRef = this.openDialog(LogoutConfirmModalComponent,param)

    dialogRef.afterClosed().subscribe((result:Logout) => {
      if(result["logoutFlag"]){
        this.authService.logout();
        this.router.navigate([constant.PATH.LOGIN])
      }
    })
  }

  private openDialog(component:any,param:object):any{
    return this.dialog.open(component,param)
  }
}