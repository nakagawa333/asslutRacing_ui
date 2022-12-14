import { Injectable } from "@angular/core";
import * as constant from "../../constants";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SettingInfo } from '../interface/settingInfo';

@Injectable({
  providedIn: 'root'
})
export class UpdateSettingInfoModalService{
  constructor(
    private http: HttpClient,
  ){}

  private url:string;

  public settingInfo:SettingInfo = {
    "title":"",
    "carId":null,
    "makerId":null,
    "courseId":null,
    "abs":false,
    "powerSteering":0,
    "diffgear":0,
    "frontTirePressure":0,
    "rearTirePressure":0,
    "tireId":null,
    "airPressure":10,
    "gearFinal":2.2,
    "gearOne":0.5,
    "gearTwo":0.5,
    "gearThree":0.5,
    "gearFour":0.5,
    "gearFive":0.5,
    "gearSix":0.5,
    "stabiliserAgo":0.1,
    "stabiliserAfter":0.1,
    "maxRudderAngle":40,
    "ackermannAngle":0.1,
    "camberAgo":0,
    "camberAfter":0,
    "breakPower":0.1,
    "breakBallance":0,
    "carHigh":10,
    "offset":0,
    "hoilesize":-1,
    "memo":"",
    "userId":null
  };

  setUrl(url:string):void{
    this.url = url
  }

  /** 設定情報を更新する  */
  updateSettingInfo(settingInfo:object){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    }
    return this.http.put(this.url,settingInfo,httpOptions)
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