
import { _isNumberValue } from '@angular/cdk/coercion';
import { ContentObserver } from '@angular/cdk/observers';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
// import {BaseModal} from '/app/BaseModal';
import { BaseModal } from '../baseModal.component';
import {AddSettingInfoModalService} from "./add-set-up-modal.service"
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../../constants';
import { StickyDirection } from '@angular/cdk/table';
import { AuthService } from "../auth.service";


@Component({
  templateUrl: './add-set-up-modal.component.html',
  styleUrls: ['./add-set-up-modal.component.css']
})
export class AddSettingInfoModalComponent implements OnInit,BaseModal{
  constructor(
      public dialogRef: MatDialogRef<AddSettingInfoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private service:AddSettingInfoModalService,
      private authService:AuthService
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

  //車リスト表示判定
  hasCarList:boolean = true;

  carHigh:number = 10;

  //設定情報
  settinInfo:any = Object.create(this.service.settinInfo);

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

    //ユーザーidを設定
    this.settinInfo["userId"] = this.authService.getUserId();
  }

  /** メーカー一覧を選択した場合  */
  makerSelectBoxChange(makerId:any){
    if(this.service.isNumber(makerId)){
      this.carsList = this.carsHashMap.get(Number(makerId));
      this.hasCarList = false;

      if(this.carsList !== null && this.carsList.length !== 0){
        this.defalutCarId = this.carsList[0]["carId"];
        //コースidを設定
        this.settinInfo["carId"] = this.defalutCarId;
      }

      //メーカーidを設定
      this.settinInfo["makerId"] = makerId
    }
  }

  /** ダイアログを閉じる */
  closeDialog(result:any = null): void{
    this.dialogRef.close(result)
  }

  /** absの状態を変更した場合 */
  absToggleChange(e:any):void{
    const checked = e["checked"]
    this.absText = checked ? "ON" : "OFF";
    //登録用設定情報のabsを変更
    this.settinInfo["abs"] = checked
  }

  /** 登録するボタンをクリックした場合 */
  addSettingClick(){
    this.addSettingInfo()  
  }

  async addSettingInfo(){
    this.service.setUrl(constant.API.URL + constant.API.ADD);
    //新規に設定情報を登録する
    await this.service.addSettingInfo(this.settinInfo)
    .subscribe({
      next:(data:any) => {
        if(data === 1){
          //登録に成功したら、ダイアログを閉じる
          this.closeDialog("登録");
          //設定情報を初期化
          this.initSettingInfo()
          alert("登録に成功しました")
        }
      },
      error: (e:any) => {
        let errors:any = e["error"]["errors"]
        let errorText:string = "";
        let errorsLength:number = Object.keys(errors).length;
        for(let i = 0; i < errorsLength; i++){
          errorText += errors[i]["field"] + " " + errors[i]["defaultMessage"] + "\n"
        }

        alert(errorText);
      }
    })
  }

  //設定情報を初期化
  initSettingInfo(){
    this.settinInfo = Object.create(this.service.settinInfo)    
  }

  //各種sliderの値を変更した場合
  onSliderChange(value:any,name:string):void{
    this.settinInfo[name] = value;
  }

  //各種テキストエリアに文字が入力された場合
  textareaInput(e:any,name:string):void{
    this.settinInfo[name] = e.target.value;
  }

  selectorChange(value:any,name:string){
    this.settinInfo[name] = value;
  }
}