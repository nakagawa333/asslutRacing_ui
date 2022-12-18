import { Component,Inject, OnInit} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    templateUrl: './message-modal.component.html',
    styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit{
    constructor(
        public dialogRef: MatDialogRef<MessageModalComponent>,
        @Inject(MAT_DIALOG_DATA) public param: any
    ){
    }

    public message:string = "";

    ngOnInit(){
        this.message = this.param?.message;
    }

    setMessage():void{
        this.message = this.param?.data?.message
    }
}