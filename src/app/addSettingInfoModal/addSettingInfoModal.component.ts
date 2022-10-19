
import { _isNumberValue } from '@angular/cdk/coercion';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { throwError } from 'rxjs';

@Component({
  templateUrl: './addSettingInfoModal.component.html',
  styleUrls: ['./addSettingInfoModal.component.css']
})
export class addSettingInfoModalComponent implements OnInit{
  constructor(
      public dialogRef: MatDialogRef<addSettingInfoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
  //車一覧
  carsList = [];
  //コース一覧
  courseList = [];
  //メーカー一覧
  makerList = [];
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
    }
  }

  /** ダイアログを閉じる */
  closeDialog(): void{
    this.dialogRef.close()
  }

  isNumber(n:any):Boolean{
    let x = + n;
    return x.toString() === n;
  }
}