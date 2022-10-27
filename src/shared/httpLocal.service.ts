import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpLocalService{
    constructor(private http: HttpClient,private headers:HttpHeaders){

    }
    private url:string

    setUrl(url:string){
        this.url = url;
    }

    async get(){
        return await this.http.get(this.url);
    }

    async post(body:any,options:object){

        return await this.http.post(this.url,body,options);
    }

    async put(body:any,options:object){
        return await this.http.put(this.url,body,options)
    }
}