
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppComponent} from 'src/app/app.component'

@Component({
  templateUrl: './delete-confirm-modal.component.html',
  styleUrls: ['./delete-confirm-modal.component.css']
})

export class DeleteConfirmModalComponent{
  constructor(
      public dialogRef: MatDialogRef<DeleteConfirmModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ){}
  yes(id:number): void{
    let result:object = {"id":id,"deleteFlag":true}
    this.close(result);
  }

  no(): void{
    let result:object = {"id":null,"deleteFlag":false}
    this.close(result);
  }

  close(result:object): void{
    this.dialogRef.close(result);
  }
}