import {ActivatedRoute, Router} from '@angular/router';
import {Component} from '@angular/core';
import { AuthService } from '../auth.service';
import * as constant from "../../constants";
import { User } from 'src/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {SnackBarConfig} from '../union/snabar';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { SnackBarService } from '../snackBar.service';


@Component({
    templateUrl: './sendPasswordResetMail.component.html',
    styleUrls: ['./sendPasswordResetMail.component.css'],
})
export class SendPasswordResetMailComponent{
    constructor(
       private activatedRoute: ActivatedRoute,
       private authService: AuthService,
       private snackBarService: SnackBarService,
       private router: Router,
       private snackBar:MatSnackBar
    ){}

    public sendPasswordResetMailForm = new FormGroup({
        mail: new FormControl("",[
            Validators.required,
            Validators.maxLength(100),
            Validators.email
        ])
    });

    //snackBarを開くための設定値
    private sendPasswordResetMailSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        duration:SnackBarConfig?.duration
    }

    public mail:FormControl<any> = this.sendPasswordResetMailForm.controls.mail

    //ログインしている際は、ホーム画面 していない場合はログイン画面
    public cancelPath:string = this.authService.isLoggedIn.getValue() ? constant.PATH.HOME : constant.PATH.LOGIN;

    ngOnInit(): void{

    }

    //記入されたメールアドレスが既に登録されているか確認する
    mailBlur(mail:string){
        if(this.sendPasswordResetMailForm.invalid) return;

        let user = new User();
        user.mail = mail;user
        this.authService.selectUserByMail(mail)
        .subscribe({
            next:(data:any) => {
                if(data < 1){
                    this.sendPasswordResetMailForm.controls.mail.setErrors({"existMail":true});
                }
            },
            error:(e:any) => {
                this.sendPasswordResetMailForm.controls.mail.setErrors({"existMail":true});
            }
        })
    }

    //送信時
    submitSendPasswordResetMailForm(){
        if(this.sendPasswordResetMailForm.invalid) return;

        let mail = this.sendPasswordResetMailForm.controls.mail.value?.trim();
        let body = {
            "mail":mail,
            "requestUrl":location.origin
        }

        //パスワードリセット用メール送信処理
        this.authService.sendPasswordResetMail(body)
        .subscribe({
            next:(data:any) => {
                this.snackBarService.openSnackBar("パスワードリセット用のメールを送信致しました");
            },
            error:(e:any) => {
                this.snackBar.open("メール送信に失敗しました","OK",this.sendPasswordResetMailSnackConfig);
            }
        })
    }

    //キャンセルクリック時
    public cancelClick():void{
        this.router.navigate([constant.PATH.LOGIN])
    }
}