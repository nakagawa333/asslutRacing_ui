import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import * as constant from "../../constants";


@Injectable({
    providedIn: 'root'
})

/**
 * ホーム画面サービスクラス
 */
export class HomeService{
    constructor(
        private http: HttpClient
    ){}

    /**
     * 設定情報を削除する
     * @param body 
     */
    deleteSettingInfo(body:object): Observable<Object>{
        return this.http.put(environment.apiUrl + constant.API.DELETE, body);
    }
}