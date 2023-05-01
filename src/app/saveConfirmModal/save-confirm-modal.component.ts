import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    templateUrl: './save-confirm-modal.component.html',
    styleUrls: ['./save-confirm-modal.component.css']
})

export class SaveConfirmModalComponent{
    constructor(
        public dialogRef: MatDialogRef<SaveConfirmModalComponent>
    ){}

    //ボタンクリック時
    buttonClick(result:boolean): void{
        this.close({"save":result});
    }

    close(result:object): void{
        this.dialogRef.close(result);
    }
}