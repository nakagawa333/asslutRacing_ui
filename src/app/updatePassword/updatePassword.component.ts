import { Component} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from 'src/user';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import * as constant from "../../constants";
import {SnackBarConfig} from '../union/snabar';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  templateUrl: './updatePassword.component.html',
  styleUrls: ['./updatePassword.component.css']
})
export class UpdatePasswordComponent{

  constructor(
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private snackBar:MatSnackBar
    ) {}

    token:String | null;

    public updatePasswordForm = new FormGroup({
      password: new FormControl("",[
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(7)
      ]),
      reconfirmPassword: new FormControl("",[

      ])
    })

    //パスワード
    public password:FormControl<any> = this.updatePasswordForm.controls.password;

    //再確認用パスワード
    public reconfirmPassword:FormControl<any> = this.updatePasswordForm.controls.reconfirmPassword;

      //snackBarを開くための設定値
      private sendPasswordUpdateMailSnackConfig:MatSnackBarConfig<any> = {
        horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
        verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
        duration:SnackBarConfig?.duration
      }

  ngOnInit(): void{
    this.token = this.activatedRoute.snapshot.queryParamMap.get("token");
  }

  //パスワード再確認から離した場合
  reconfirmPasswordBlur(){
      this.checkPassword();
  }

  //送信時
  updatePasswordFormSubmit(){
    if(this.updatePasswordForm.invalid) return;

    let body = {
      "token":this.token,
      "password":this.password.value
    }

    //パスワードリセット処理
    this.authService.passwordUpdate(body)
    .subscribe({
      next:(passwordUpdateSucessFlag:any) => {
        if(passwordUpdateSucessFlag) {
          this.snackBar.open("パスワード更新に成功しました。","",this.sendPasswordUpdateMailSnackConfig);
          this.router.navigate([constant.API.LOGIN])
        }
      },
      error:(e:any) => {
        this.snackBar.open("パスワード更新に成功しました。","",this.sendPasswordUpdateMailSnackConfig);
      }
    })
  }

  //パスワードと再確認用パスワードの値が同じであるかを確認する
  checkPassword():boolean{
    if(this.updatePasswordForm.controls.password.value !== this.updatePasswordForm.controls.reconfirmPassword.value){
        this.updatePasswordForm.controls.reconfirmPassword.setErrors({"diffPassword":true});
        return false;
    }
    return true;
  }
}