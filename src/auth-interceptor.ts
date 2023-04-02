import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, ɵHttpInterceptingHandler } from "@angular/common/http";
import { AuthService } from "./app/auth.service";
import * as constant from "./constants";
import { throwError } from "rxjs/internal/observable/throwError";
import { CookieService } from "ngx-cookie-service";
import { catchError, concatMap, Observable, switchMap } from "rxjs";

/**
 * Http共通設定クラス
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private cookie:CookieService
    ) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let self = this;

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
                self.cookie.set(constant.COOKIE.ACESSTOKEN,acessToken);

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