import { ActivatedRoute,ParamMap, Router  } from '@angular/router';
import { map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { UpdateMailService } from './updateMail.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResponseService } from '../http-error-response.service';
import { SnackBarService } from '../snackBar.service';
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import { AuthService } from '../auth.service';


@Component({
  templateUrl: './updateMail.component.html',
  styleUrls: ['./updateMail.component.css']
})

/**
 * メール更新
 */
export class UpdateMailComponent{

  constructor(
    private route: ActivatedRoute,
    private updateMailService : UpdateMailService,
    private httpErrorResponseService: HttpErrorResponseService,
    private snackBarService:SnackBarService,
    private errorSnackBarService:ErrorSnackBarService,
    private router: Router,
    private authService:AuthService
    ) {}

    ngOnInit(): void{
      let self = this;
      //urlからトークンを取得する
      let token = self.route.snapshot.queryParamMap.get("token");
      if(token !== null){
        //メールを更新する
        self.updateMail(token);
      }
    }

    /**
     * メールを更新する
     * @param token トークン
     */
    updateMail(token:string): void{
      let self = this;
      self.updateMailService.updateMail(token)
      .subscribe({
        next:(e:any) => {
          self.snackBarService.openSnackBar("メールの更新に成功しました");
          self.RouterNavigate();
        },

        error:(e:HttpErrorResponse) => {
          let errorMessageList:string[] = self.httpErrorResponseService.createErrorMessageList(e);
          self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
          //アカウント情報画面に戻る
          self.router.navigate(["settings/account"]);
          self.RouterNavigate();
        }
      })
    }

    RouterNavigate():void{
      let self = this;
      //ログイン状態化を確認
      if(self.authService.isLoggedIn){
        //アカウント情報画面に戻る
        self.router.navigate(["settings/account"]);
      } else {
        //ログイン画面に戻る
        self.router.navigate(["/login"]);
      }
    }
}