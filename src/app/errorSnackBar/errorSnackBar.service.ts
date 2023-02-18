import { Injectable,OnInit,Component } from "@angular/core";
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import * as constant from '../../constants';
import { SnackBarConfig } from "../union/snabar";
import { ErrorSnackBarComponent } from "./errorSnackBar.component";

@Injectable({
    providedIn: 'root'
})

export class ErrorSnackBarService{
    constructor(
        private snackBar:MatSnackBar
    ){}

    //snackBarを開くための設定値
    private modalSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        data:[],
        panelClass:["error-snackbar"],
        duration:SnackBarConfig?.duration
    }

    openSnackBar(e:any):void{
        let self = this;
        let errors:any = e?.error?.errors;
        let errorMessageList:string[] = [];
        if(errors){
          let errorsLength:number = Object.keys(errors).length;
          for(let i = 0; i < errorsLength; i++){
            errorMessageList.push(errors[i]["field"] + " " + errors[i]["defaultMessage"] + "\n ")
          }
        } else {
            errorMessageList.push("原因不明のエラーが発生しました");
        }
        self.snackBar.openFromComponent(ErrorSnackBarComponent,self.modalSnackConfig);
    }

    openSnackBarForErrorMessage(errorMessageList:string[]){
        let self = this;

        let errorMessageListLength = errorMessageList.length;

        if(0 < errorMessageListLength){
            errorMessageList[0] = " " + errorMessageList[0];
            //最後のエラーメッセージは改行しない
            for(let i = 0; i < errorMessageListLength - 1; i++){
                errorMessageList[i] = errorMessageList[i] + "\n";
            }
        }

        self.modalSnackConfig.data = errorMessageList;
        
        self.snackBar.openFromComponent(ErrorSnackBarComponent,self.modalSnackConfig);
    }
}
