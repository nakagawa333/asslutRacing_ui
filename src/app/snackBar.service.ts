import { Injectable,OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../constants";
import { BehaviorSubject } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { ObserversModule } from "@angular/cdk/observers";
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