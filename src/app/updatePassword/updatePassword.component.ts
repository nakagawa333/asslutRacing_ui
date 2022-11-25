import { Component} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from 'src/user';
import { FormControl, FormGroup,Validators } from '@angular/forms';

@Component({
  templateUrl: './updatePassword.component.html',
  styleUrls: ['./updatePassword.component.css']
})
export class UpdatePasswordComponent{

  constructor(
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute  ) {}

    token:String | null;

    public updatePasswordForm = new FormGroup({
      password: new FormControl("",[
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(7)
      ])
    })

    public password:FormControl<any> = this.updatePasswordForm.controls.password;

  ngOnInit(): void{
    this.token = this.activatedRoute.snapshot.queryParamMap.get("token");
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
      next:(data:any) => {
        if(data === 1) alert("パスワード更新に成功しました。")
      },
      error:(e:any) => {
        alert("パスワード送信に失敗しました");
      }
    })
  }
}