
import { _isNumberValue } from '@angular/cdk/coercion';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BaseModal } from '../baseModal.component';
import * as constant from '../../constants';
import { AuthService } from "../auth.service";
import {  SnackBarConfig} from '../union/snabar';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import {UpdateSettingInfoModalService} from "./update-setting-info-modal.service";

@Component({
  templateUrl: "./update-setting-info-modal.component.html",
  styleUrls: ["./update-setting-info-modal.component.css"]
})
export class UpdateSettingInfoModalComponent implements OnInit,BaseModal{
  constructor(
      public dialogRef: MatDialogRef<UpdateSettingInfoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private authService:AuthService,
      private snackBar:MatSnackBar,
      private service:UpdateSettingInfoModalService
  ){}

  //メーカーidの初期値
  public defaultMakerId:number = 0;
  //車idの初期値
  public defalutCarId:number = 0;
  //コースidの初期値
  public defaultCourseId:number = 0;
  //タイヤidの初期値
  public defaultTireId:number = 0;

  public absText = "OFF";
  //車一覧
  public carsList = [];
  //コース一覧
  public courseList = [];
  //メーカー一覧
  public makerList = [];
  //タイヤタイプ一覧
  public tireTypeList = [];
  /** key:makerId value:object */
  private carsHashMap = new Map();

  private selectGuidMessage:string = "選択してください"

  private carHigh:number = 10;

  //absフラグ off:false, on:true
  public absFlag = true;

  //設定情報
  // public settingInfo:any = Object.assign({},this.service.settingInfo);
  public settingInfo:any = {}

  //snackBarを開くための設定値
  private updateSetupModalSnackConfig:MatSnackBarConfig<any> = {
    horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
    verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
    duration:SnackBarConfig?.duration
  }

  ngOnInit(): void{
    if(this.data === null) return;
    let infos = this.data?.infos;
    if(infos !== null){
      this.courseList = infos.courseList
      this.makerList = infos.makerList
      this.tireTypeList = infos.tireTypeList

      let carsList = infos.carsList
      if(carsList !== null){
        for(let car of carsList){
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

    let settingInfo = this.data?.settingInfo;
    if(settingInfo != null){
      this.settingInfo = settingInfo;
      //absのテキストを変更 ON checked:true OFF checked:false
      this.absTextChange(this.settingInfo.abs)

      //メーカーidを設定
      this.defaultMakerId = settingInfo["makerId"];
      //車idを設定
      this.defalutCarId = settingInfo["carId"];
      //コースidを設定
      this.defaultCourseId = settingInfo["courseId"];
      //タイヤidを設定
      this.defaultTireId = settingInfo["tireId"];

      //車一覧を設定
      this.carsList = this.carsHashMap.get(Number(this.defaultMakerId));
    }
  }

  /** メーカー一覧を選択した場合  */
  makerSelectBoxChange(makerId:any){
    if(this.service.isNumber(makerId)){
      this.carsList = this.carsHashMap.get(Number(makerId));

      if(this.carsList !== null && this.carsList.length !== 0){
        this.defalutCarId = this.carsList[0]["carId"];
        //車idの初期値を設定
        this.settingInfo["carId"] = this.defalutCarId;
      }

      //メーカーidを設定
      this.settingInfo["makerId"] = makerId
    }
  }

  /** ダイアログを閉じる */
  closeDialog(result:any = null): void{
    this.dialogRef.close(result)
  }

  /** absの状態を変更した場合 */
  absToggleChange(e:any):void{
    const checked = e["checked"]
    this.absTextChange(checked)
    //登録用設定情報のabsを変更
    this.settingInfo["abs"] = checked
  }

  /** absのテキストを変更 ON checked:true OFF checked:false */
  absTextChange(checked:boolean):void{
    this.absText = checked ? "ON" : "OFF";
  }

  /** 登録するボタンをクリックした場合 */
  updateSettingClick():void{
    this.updateSettingInfo()
  }

  private updateSettingInfo():void{
    this.service.setUrl(constant.API.URL + constant.API.UPDATE);
    //新規に設定情報を更新する
    this.service.updateSettingInfo(this.settingInfo)
    .subscribe({
      next:(isUpdate:any) => {
        if(isUpdate){
          //更新に成功したら、ダイアログを閉じる
          this.closeDialog("更新");
          this.snackBar.open("更新に成功しました","",this.updateSetupModalSnackConfig);
        }
      },
      error: (e:any) => {
        let errors:any = e["error"]["errors"]
        let errorText:string = "";
        let errorsLength:number = Object.keys(errors).length;
        for(let i = 0; i < errorsLength; i++){
          errorText += errors[i]["field"] + " " + errors[i]["defaultMessage"] + "\n "
        }

        this.snackBar.open(errorText,"",this.updateSetupModalSnackConfig);
      }
    })
  }

  //各種sliderの値を変更した場合
  onSliderChange(value:any,name:string):void{
    this.settingInfo[name] = value;
  }

  //各種テキストエリアに文字が入力された場合
  textareaInput(e:any,name:string):void{
    this.settingInfo[name] = e.target.value;
  }

  selectorChange(value:any,name:string):void{
    this.settingInfo[name] = value;
  }
}