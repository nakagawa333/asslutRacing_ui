import { Injectable,OnInit } from "@angular/core";
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import * as constant from '../../constants';
import { SnackBarConfig } from "../union/snabar";

@Injectable({
    providedIn: 'root',
})

export class ErrorSnackService{
    constructor(
        private snackBar:MatSnackBar
    ){}

    //snackBarを開くための設定値
    private modalSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        duration:SnackBarConfig?.duration
    }

    openSnackBar(e:any):void{
        let self = this;
        let errors:any = e?.error?.errors;
        let errorText:string = "";
        if(errors){
          let errorsLength:number = Object.keys(errors).length;
          for(let i = 0; i < errorsLength; i++){
            errorText += errors[i]["field"] + " " + errors[i]["defaultMessage"] + "\n "
          }  
        } else {
            errorText = "原因不明のエラーが発生しました";
        }
        self.snackBar.open(errorText,"OK",self.modalSnackConfig);
    }

    openSnackBarForErrorMessage(errorMessage:string){
        let self = this;
        self.snackBar.open(errorMessage,"OK",self.modalSnackConfig);
    }
}
