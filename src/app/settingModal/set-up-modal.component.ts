
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  templateUrl: './set-up-modal.component.html',
  styleUrls: ['./set-up-modal.component.css']
})
export class settingModalComponent{
  constructor(
      public dialogRef: MatDialogRef<settingModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
  closeDialog(): void{
    this.dialogRef.close()
  }
}