import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as constant from "../../constants"
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SettingsAccountUserNameService{
  constructor(
    private http:HttpClient
  ){}

  //ユーザーの設定情報を取得する
  updateUserName(body:any){
    return this.http.put(environment.apiUrl + constant.API.UPDATEUSERUSERNAME,body);
  }
}