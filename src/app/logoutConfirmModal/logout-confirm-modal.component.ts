
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppComponent} from 'src/app/app.component'
import { Logout } from '../interface/logout';

@Component({
  templateUrl: './logout-confirm.component.html',
  styleUrls: ['./logout-confirm-modal.component.css']
})

export class LogoutConfirmModalComponent{
  constructor(
      public dialogRef: MatDialogRef<LogoutConfirmModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ){}
  yes(): void{
    let result:Logout = {"logoutFlag":true}
    this.close(result);
  }

  no(): void{
    let result:Logout = {"logoutFlag":false}
      this.close(result);
  }

  close(result:object): void{
    this.dialogRef.close(result);
  }
}