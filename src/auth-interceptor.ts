import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from "./app/auth.service";

/**
 * 認証共通設定クラス
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getAccessToken();

        let headers:any = {
            'Content-Type': 'application/json',
        }

        if(authToken){
            headers["Authorization"] = "Basic " + authToken
        }

        req = req.clone({
            setHeaders:headers
        });
        
        return next.handle(req);
    }
}