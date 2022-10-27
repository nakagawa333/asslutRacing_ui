
import { _isNumberValue } from '@angular/cdk/coercion';
import { ContentObserver } from '@angular/cdk/observers';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
// import {BaseModal} from '/app/BaseModal';
import { BaseModal } from '../baseModal.component';
import {AddSettingInfoModalService} from "../addSettingInfoModal/addSettingInfoModal.service"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../../constants';

@Component({
  templateUrl: './addSettingInfoModal.component.html',
  styleUrls: ['./addSettingInfoModal.component.css']
})
export class AddSettingInfoModalComponent implements OnInit,BaseModal{
  constructor(
      public dialogRef: MatDialogRef<AddSettingInfoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private service:AddSettingInfoModalService,
  ){}

  defalutCarId:number = 0;
  absText = "OFF";
  //車一覧
  carsList = [];
  //コース一覧
  courseList = [];
  //メーカー一覧
  makerList = [];
  //タイヤタイプ一覧
  tireTypeList = [];
  /** key:makerId value:object */
  carsHashMap = new Map();

  selectGuidMessage:string = "選択してください"

  hasCarList:boolean = true;

  settinInfo:any = {
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
    "stabiliserAgo":0.1,
    "stabiliserAfter":0.1,
    "maxRudderAngle":40,
    "ackermannAngle":0.1,
    "camberAgo":-10,
    "camberAfter":-10,
    "breakPower":0.1,
    "breakBallance":0,
    "carHigh":10,
    "offset":0,
    "hoilesize":-1,
    "memo":""
  }

  ngOnInit(): void{
    if(this.data === null) return;
    let dates = this.data.dates

    if(dates !== null){
      this.courseList = dates.courseList
      this.makerList = dates.makerList
      this.tireTypeList = dates.tireTypeList

      for(let car of dates.carsList){
        let makerId:number = car["makerId"];
        if(this.carsHashMap.has(makerId)){
          let value:Array<any> = this.carsHashMap.get(makerId);
          value.push(car)
          this.carsHashMap.set(makerId,value)
        } else {
          this.carsHashMap.set(makerId,[car]);
        }
      }
    }
  }

  /** メーカー一覧を選択した場合  */
  makerSelectBoxChange(makerId:any){
    if(this.service.isNumber(makerId)){
      this.carsList = this.carsHashMap.get(Number(makerId));
      this.hasCarList = false;

      if(this.carsList !== null && this.carsList.length !== 0){
        this.defalutCarId = this.carsList[0]["carId"]
      }

      this.settinInfo["makerId"] = makerId
    }
  }

  /** ダイアログを閉じる */
  closeDialog(): void{
    this.dialogRef.close()
  }

  /** absの状態を変更した場合 */
  absToggleChange(e:any):void{
    const checked = e["checked"]
    this.absText = checked ? "ON" : "OFF";
    //登録用設定情報のabsを変更
    this.settinInfo["abs"] = checked
  }

  /** 登録するボタンをクリックした場合 */
  async addSettingInfo(){
    let headers:HttpHeaders = new HttpHeaders();
    headers.append("Content-Type","application/json");
    this.service.setUrl(constant.API.URL + constant.API.ADD)
    //新規に設定情報を登録する
    let res = await this.service.addSettingInfo(this.settinInfo,headers);
    //登録に成功したら、ダイアログを閉じる
    this.closeDialog();
  }

  //各種sliderの値を変更した場合
  onSliderChange(value:any,name:string):void{
    this.settinInfo[name] = value;
  }

  //各種テキストエリアに文字が入力された場合
  textareaInput(e:any,name:string):void{
    this.settinInfo[name] = e.target.value;
  }

  selectorChange(e:any,name:string){
    this.settinInfo[name] = e.target.value;
  }
}