import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "./app/auth.service";
import * as constant from "./constants";
import { throwError } from "rxjs/internal/observable/throwError";
import { CookieService } from "ngx-cookie-service";
import { catchError, concatMap, Observable, switchMap } from "rxjs";
import { Route, Router, Routes } from "@angular/router";
import { ErrorSnackBarService } from "./app/errorSnackBar/errorSnackBar.service";

/**
 * Http共通設定クラス
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    //キーがパス
    private routerMap = new Map<String,Route>();

    constructor(
        private authService: AuthService,
        private cookie:CookieService,
        private router: Router,
        private errorSnackBarService:ErrorSnackBarService
    ) { 
        let self = this;
        let config:Routes = self.router.config;
        for(let c of config){
            let path = c?.path;
            if(path){
                self.routerMap.set("/" + path,c);
            }
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let self = this;

        let url = new URL(location.href);
        let route = self.routerMap.get(url.pathname);

        //ログインが必要な画面でリフレッシュトークンを取得できない場合、強制ログアウト
        if(!self.authService.checkIsLoggedIn() && route?.canActivate){
            self.errorSnackBarService.openSnackBarForErrorMessage(["不正なアクセスです。再度ログインをお願いいたします。"])
            self.authService.logout();
        }

        //ヘッダー
        let headers = self.getHeaders(req);

        req = req.clone({
            setHeaders:headers
        });
        
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 500 
                    && err.error.message === constant.MESSAGE.EXPIREDACCESSTOKEN) {
                    //アクセストークンの有効期限が切れている場合
                    return self.expiredJwtError(req,next);
                }
                return throwError(err);
        }));
    }

    /**
     * ヘッダー情報を取得する
     * @param req HTTPリクエスト
     * @returns ヘッダー情報
     */
    getHeaders(req: HttpRequest<any>){
        let self = this;
        let headers:any = {
            'Content-Type': 'application/json',
        }

        //トークン
        let token = self.authService.getAccessToken();
        if(token){
            headers["Authorization"] = "Basic " + token
        }
        return headers;
    }

    /**
     * jwt認証
     * @param req 
     * @param next 
     * @returns 
     */
    expiredJwtError(req: HttpRequest<any>,next:HttpHandler): Observable<any> {
        let self = this;

        let body = {
            "refreshToken":self.authService.getRefreshToken()
        }
        //リフレッシュトークンにより再認証
        return self.authService.refreshToken(body).pipe(
            concatMap((data:any) => {
                let acessToken = data["acessToken"]
                self.cookie.delete(constant.COOKIE.ACESSTOKEN,"/");
                self.cookie.set(constant.COOKIE.ACESSTOKEN,acessToken,constant.COOKIE.EXPIREDYEAR,constant.COOKIE.PATH);

                return next.handle(req.clone({setHeaders:self.getHeaders(req)}));
            }),
            catchError((err) => {
                //アクセストークン更新に失敗した場合、ログアウト
                self.authService.logout();
                return throwError(err);
            })
        )
    }
}