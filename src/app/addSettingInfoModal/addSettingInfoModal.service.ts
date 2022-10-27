import { Injectable } from "@angular/core";
import * as constant from "../../constants";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddSettingInfoModalService{
  constructor(private http: HttpClient){

  }

  private url:string;

  setUrl(url:string):void{
    this.url = url
  }

  /** 新規に設定情報を登録する  */
  async addSettingInfo(settinInfo:object,options:object){
    await this.http.post(this.url,settinInfo,options)
    .subscribe({
      next:(data) => {
        console.log(data)
        return data;
      },
      error: (error) => {
        console.log(error)
        return error;
      }
    })
  }

  //数字であるかを判定
  isNumber(n:any):Boolean{
    try{
      Number(n);
    } catch(e:any){
      return false;
    }
    return true;
  }
}