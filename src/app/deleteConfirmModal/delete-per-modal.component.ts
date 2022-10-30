
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppComponent} from 'src/app/app.component'

@Component({
  templateUrl: './delete-per-modal.component.html',
  styleUrls: ['./delete-per-modal.component.css']
})

export class deleteConfirmModalComponent{
  constructor(
      public dialogRef: MatDialogRef<deleteConfirmModalComponent>,
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

  onClick(val:any){
    console.log(val)
  }

  close(result:object): void{
    this.dialogRef.close(result);
  }
}