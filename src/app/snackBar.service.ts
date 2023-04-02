import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { SnackBarConfig } from "./union/snabar";

@Injectable({
    providedIn: 'root',
})

export class SnackBarService{
    constructor(
        private snackBar:MatSnackBar
    ){}

    //snackBarを開くための設定値
    private modalSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        duration:SnackBarConfig?.duration
    }

    openSnackBar(message:string):void{
        let self = this;
        self.snackBar.open(message,"OK",self.modalSnackConfig);
    }
}