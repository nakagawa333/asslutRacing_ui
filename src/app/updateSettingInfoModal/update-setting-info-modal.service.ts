import { Injectable } from "@angular/core";
import * as constant from "../../constants";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SettingInfo } from '../interface/settingInfo';
import { SettingInfoMatSliderValue } from '../settingInfoMatSliderValue';


@Injectable({
  providedIn: 'root'
})
export class UpdateSettingInfoModalService{
  constructor(
    private http: HttpClient,
  ){}

  private url:string;

  public MatSliderValue = SettingInfoMatSliderValue;

  public settingInfo:SettingInfo = {
    "title":"",
    "carId":null,
    "makerId":null,
    "courseId":null,
    "abs":false,
    "powerSteering":this.MatSliderValue.PowerSteering.MIN,
    "diffgear":this.MatSliderValue.Diffgear.MIN,
    "frontTirePressure":this.MatSliderValue.FrontTirePressure.MIN,
    "rearTirePressure":this.MatSliderValue.RearTirePressure.MIN,
    "tireId":null,
    "airPressure":this.MatSliderValue.AirPressure.MIN,
    "gearFinal":this.MatSliderValue.GearFinal.MIN,
    "gearOne":this.MatSliderValue.GearOne.MIN,
    "gearTwo":this.MatSliderValue.GearTwo.MIN,
    "gearThree":this.MatSliderValue.GearThree.MIN,
    "gearFour":this.MatSliderValue.GearFour.MIN,
    "gearFive":this.MatSliderValue.GearFive.MIN,
    "gearSix":this.MatSliderValue.GearSix.MIN,
    "stabiliserAgo":this.MatSliderValue.StabiliserAgo.MIN,
    "stabiliserAfter":this.MatSliderValue.StabiliserAfter.MIN,
    "maxRudderAngle":this.MatSliderValue.MaxRudderAngle.MIN,
    "ackermannAngle":this.MatSliderValue.AckermannAngle.MIN,
    "camberAgo":this.MatSliderValue.CamberAgo.MIN,
    "camberAfter":this.MatSliderValue.CamberAfter.MIN,
    "breakPower":this.MatSliderValue.BreakPower.MIN,
    "breakBallance":this.MatSliderValue.BreakBallance.MIN,
    "carHigh":this.MatSliderValue.CarHigh.MIN,
    "offset":this.MatSliderValue.Offset.MIN,
    "hoilesize":this.MatSliderValue.Hoilesize.MIN,
    "memo":"",
    "userId":null,
    "imgBase64Url":""
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