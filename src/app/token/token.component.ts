import { Router,ActivatedRoute } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import * as constant from "../../constants";

@Component({
    templateUrl: './token.component.html'
})
export class TokenComponent{
    constructor(
       private activatedRoute: ActivatedRoute,
       private authService: AuthService,
       private router: Router,
    ){}
    ngOnInit(): void{
        let token:String | null = this.activatedRoute.snapshot.queryParamMap.get("token")
        
        let body:object = {
            "token":token
        }
        this.authService.verifyToken(token).subscribe({
            next:(data:any) => {
                //ユーザー登録に成功した場合
                if(data === 1){
                    alert("登録に成功しました")
                    this.router.navigate([constant.API.LOGIN])
                }
            },
            error:(e:any) => {
                alert("サインアップに失敗しました")
            }
        })
    }
}