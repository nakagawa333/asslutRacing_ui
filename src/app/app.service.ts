import { Injectable } from "@angular/core";
import * as constant from "../constants"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

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

    async getAllSettingInfo(){
        return await this.http.get(constant.API.URL + constant.API.HOME,{
            responseType:"json"
        })
    }

    async deleteSettingInfo(body:any){
        return await this.http.put(constant.API.URL + constant.API.DELETE,body)
    }

    public changeDataToMatTableDataSource(datas:any){
        return new MatTableDataSource(datas);
    }
}