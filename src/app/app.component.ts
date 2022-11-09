import { Component,Inject, OnInit,ViewChild,inject} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppService} from "../app/app.service";
import {settingModalComponent} from 'src/app/settingModal/set-up-modal.component';
import {deleteConfirmModalComponent} from 'src/app/deleteConfirmModal/delete-per-modal.component'
import {AddSettingInfoModalComponent} from 'src/app/addSettingInfoModal/add-set-up-modal.component';
import {MatPaginator} from '@angular/material/paginator';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../constants';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    let isLoggedIn = this.authService.getIsLoggedIn();
    //認証されていない場合とログインページでない場合
    if(!isLoggedIn && location.pathname !== "/login"){
      //ログイン画面に遷移
      this.router.navigate(["/login"])
    }
  }
}