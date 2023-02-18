import { Injectable,OnInit,Component,inject,Inject } from "@angular/core";
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import * as constant from '../../constants';
import { SnackBarConfig } from "../union/snabar";


@Component({
    templateUrl: './errorSnackBar.component.html',
    styleUrls: ['./errorSnackBar.component.css']
})

export class ErrorSnackBarComponent{
    constructor(
        public snackBar:MatSnackBar,
        @Inject(MAT_SNACK_BAR_DATA) public data: string[]
    ){}

    public snackBarRef = inject(MatSnackBarRef);

    //エラーメッセージ一覧
    public errorMessageList:string[] = this.data;
}
