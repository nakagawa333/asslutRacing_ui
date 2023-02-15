import {ActivatedRoute, Router} from '@angular/router';
import {Component} from '@angular/core';
import { AuthService } from '../auth.service';
import * as constant from "../../constants";
import { NotificationService } from "../../notification.service";
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { SnackBarConfig } from '../union/snabar';
import { SnackBarService } from '../snackBar.service';

@Component({
    templateUrl: './token.component.html'
})
export class TokenComponent{
    constructor(
       private activatedRoute: ActivatedRoute,
       private authService: AuthService,
       private router: Router,
       private snackBarService: SnackBarService,
       private snackBar: MatSnackBar
    ){}

    //snackBarを開くための設定値
    private regitSucessSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        duration:SnackBarConfig?.duration
    }

    ngOnInit(): void{
        let token:String | null = this.activatedRoute.snapshot.queryParamMap.get("token")

        let body:object = {
            "token":token
        }

        this.authService.verifyToken(token).subscribe({
            next:(userAddSucessFlag:any) => {
                //ユーザー登録に成功した場合
                if(userAddSucessFlag){
                    //snackBarを開く
                    this.snackBarService.openSnackBar("ユーザー登録に成功しました");
                    this.router.navigate([constant.API.LOGIN])
                } else {
                    this.snackBar.open("ユーザー登録に失敗しました","OK",this.regitSucessSnackConfig);
                }
            },
            error:(e:any) => {
                this.snackBar.open("ユーザー登録に失敗しました","OK",this.regitSucessSnackConfig);
            }
        })
    }
}