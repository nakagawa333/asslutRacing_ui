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
import { SnackBarService } from './snackBar.service';

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
    private snackBarService:SnackBarService,
    private lo: Location
  ) {
  }

  //ログインしている際は、ログイン画面 していない場合はホーム
  public path = this.authService.checkIsLoggedIn() ? constant.PATH.HOME : constant.PATH.LOGIN;
  
  public positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  public position = new FormControl(this.positionOptions[0]);

  //ログアウトアイコンクリック時
  public logoutClick():void{
    let self = this;
    self.logoutConfilmOpenDialog();
  }


  private logoutConfilmOpenDialog():void{
    let self = this;
    const param:object = {
      data:{"title":"ログアウトしてもよろしいでしょうか？"},
      id:"logout-confilm-modal"
    }
    const dialogRef = self.openDialog(LogoutConfirmModalComponent,param)

    dialogRef.afterClosed().subscribe((result:Logout) => {
      if(result["logoutFlag"]){
        self.snackBarService.openSnackBar(constant.MESSAGE.LOGOUTSUCESS);
        //ログアウト
        self.authService.logout();
      }
    })
  }

  private openDialog(component:any,param:object):any{
    let self = this;
    return self.dialog.open(component,param)
  }
}