import {ActivatedRoute, Router} from '@angular/router';
import {Component} from '@angular/core';
import { AuthService } from '../auth.service';
import * as constant from "../../constants";
import { User } from 'src/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './sendPasswordResetMail.component.html',
    styleUrls: ['./sendPasswordResetMail.component.css'],
})
export class SendPasswordResetMailComponent{
    constructor(
       private activatedRoute: ActivatedRoute,
       private authService: AuthService,
       private router: Router,
    ){}

    public sendPasswordResetMailForm = new FormGroup({
        mail: new FormControl("",[
            Validators.required,
            Validators.maxLength(100),
            Validators.email
        ])
    });

    public mail:FormControl<any> = this.sendPasswordResetMailForm.controls.mail

    ngOnInit(): void{

    }

    //記入されたメールアドレスが既に登録されているか確認する
    mailBlur(mail:String){
        if(this.sendPasswordResetMailForm.invalid) return;

        let user = new User();
        user.mail = mail;user
        this.authService.selectUser(user)
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

        let mail = this.sendPasswordResetMailForm.controls.mail.value;
        let body = {
            "mail":mail,
            "requestUrl":location.origin
        }

        //パスワードリセット用メール送信処理
        this.authService.sendPasswordResetMail(body)
        .subscribe({
            next:(data:any) => {
                alert("パスワードリセット用のメールを送信致しました");
            },
            error:(e:any) => {
                alert("メール送信に失敗しました");
            }
        })
    }
}