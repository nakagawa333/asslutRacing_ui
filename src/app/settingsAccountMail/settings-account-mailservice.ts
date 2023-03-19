import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as constant from "../../constants"
import { UpdateMail } from "../updateMail";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

/**
 * 
 */
export class SettingsAccountMailService{
  constructor(
    private http:HttpClient
  ){}

  //メール更新用メール送信
  sendMailUpdateMail(body:UpdateMail){
    return this.http.post(environment.apiUrl + constant.API.SENDMAILUPDATEMAIL,body);
  }
}