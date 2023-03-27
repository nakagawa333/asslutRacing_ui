import { Injectable } from "@angular/core";
import * as constant from "../constants"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import {environment} from "../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class AppService{

    constructor(private http: HttpClient){

    }

    dates : MatTableDataSource<any> = new MatTableDataSource;
    private url:string;

    public setUrl(url:string):void{
        this.url = url
    }

    public getAllSettingInfo(userId:string){
        return this.http.get(environment.apiUrl + constant.API.HOME + userId)
    }

    async deleteSettingInfo(body:any){
        return await this.http.put(environment.apiUrl + constant.API.DELETE,body)
    }

    public changeDataToMatTableDataSource(datas:any){
        return new MatTableDataSource(datas);
    }
}