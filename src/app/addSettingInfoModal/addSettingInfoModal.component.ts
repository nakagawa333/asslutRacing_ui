
import { _isNumberValue } from '@angular/cdk/coercion';
import { ContentObserver } from '@angular/cdk/observers';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
// import {BaseModal} from '/app/BaseModal';
import { BaseModal } from '../baseModal.component';

@Component({
  templateUrl: './addSettingInfoModal.component.html',
  styleUrls: ['./addSettingInfoModal.component.css'],
  host: {
    "(window:resize)":"onResize($event)"
  }
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
}