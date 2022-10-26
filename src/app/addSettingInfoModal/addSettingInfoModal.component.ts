
import { _isNumberValue } from '@angular/cdk/coercion';
import { ContentObserver } from '@angular/cdk/observers';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
// import {BaseModal} from '/app/BaseModal';
import { BaseModal } from '../baseModal.component';

@Component({
  templateUrl: './addSettingInfoModal.component.html',
  styleUrls: ['./addSettingInfoModal.component.css']
})
export class AddSettingInfoModalComponent implements OnInit,BaseModal{
  constructor(
      public dialogRef: MatDialogRef<AddSettingInfoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
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
    if(this.isNumber(makerId)){
      this.carsList = this.carsHashMap.get(Number(makerId));
      this.hasCarList = false;

      if(this.carsList !== null && this.carsList.length !== 0){
        this.defalutCarId = this.carsList[0]["carId"]
      }
    }
  }

  /** ダイアログを閉じる */
  closeDialog(): void{
    this.dialogRef.close()
  }

  isNumber(n:any):Boolean{
    try{
      Number(n);
    } catch(e:any){
      return false;
    }
    return true;
  }

  /** absの状態を変更した場合 */
  absToggleChange(e:any):void{
    const checked = e["checked"]
    this.absText = checked ? "ON" : "OFF";
  }

  /** 登録するボタンをクリックした場合 */
  addSettingInfo(){

  }

  onChange(value:any,name:string){
    this.settinInfo[name] = value;
  }
}