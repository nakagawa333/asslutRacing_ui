import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from "rxjs";
import * as constant from "../../constants"
import { AuthService } from "../auth.service";
import { SelectUserPassword } from "../selectUserPassword";
import { UpdateMail } from "../updateMail";

@Injectable({
  providedIn: 'root'
})

/**
 * パスワード情報設定サービスクラス
 */
export class SettingsAccountPasswordService{
  constructor(
    private http:HttpClient,
    private authService:AuthService
  ){}

  /**
   * パスワードによるユーザー情報検索
   * @param password パスワード
   * @param userId ユーザーid
   * @returns 
   */
  selectUserByPassword(password:string,userId:number):Observable<Object>{
    let self = this;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    }

    let selectUserPassword:SelectUserPassword = {
      userId:userId,
      password:password
    }
    return self.http.post(constant.API.URL + constant.API.SELECTUSERBYPASSWORD,selectUserPassword);
  }

  /**
   * パスワード最新化
   * @param oldPassword 前のパスワード
   * @param newPassword 新しいパスワード
   * @param userId ユーザーid
   * @returns 
   */
  currentPassword(oldPassword:string,newPassword:string,userId:number):Observable<Object>{
    let self = this;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    }

    let currentPassword = {
      userId:userId,
      oldPassword:oldPassword,
      newPassword:newPassword
    }
    
    return self.http.put(constant.API.URL + constant.API.PASSWORDCURRENT,currentPassword)
  }
}