
import { _isNumberValue } from '@angular/cdk/coercion';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BaseModal } from '../baseModal.component';
import * as constant from '../../constants';
import { AuthService } from "../auth.service";
import {  SnackBarConfig} from '../union/snabar';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import {UpdateSettingInfoModalService} from "./update-setting-info-modal.service";
import { SettingInfo } from '../interface/settingInfo';
import { OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { SnackBarService } from '../snackBar.service';
import { SettingInfoMatSliderValue } from '../settingInfoMatSliderValue';
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import { EnabledBlockingInitialNavigationFeature } from '@angular/router';
import { environment } from 'src/environments/environment';

type Nullable<T> = T | undefined | null;

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
      private snackBarService: SnackBarService,
      private errorSnackBarService:ErrorSnackBarService,
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

  //設定情報
  public settingInfo:SettingInfo = Object.assign({},this.service.settingInfo);

  //snackBarを開くための設定値
  private updateSetupModalSnackConfig:MatSnackBarConfig<any> = {
    horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
    verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
    duration:SnackBarConfig?.duration
  }

  public updateSettingInfoForm = new FormGroup({
    settingName:new FormControl("",[
      Validators.required,
      Validators.maxLength(100)
    ])
  })

  public MatSliderValue = SettingInfoMatSliderValue;

  /**
   * セッティングネイムに値を挿入する
   * @param settingName セッティングネイム
   */
  public setSettingName(settingName:string){
    this.updateSettingInfoForm.controls.settingName.setValue(settingName);
  }

  //セッティングネイム
  public settingName = this.updateSettingInfoForm.controls.settingName;

  //設定情報エラーメッセージ
  public settingNameErrorMessage:String = "";

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

      this.settingNameValueChanges();
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

    if(this.settingInfo["title"]){
      this.setSettingName(this.settingInfo["title"]);
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
    let self = this;

    if(self.settingName.invalid){
      self.errorSnackBarService.openSnackBarForErrorMessage(["セッティングネイムを入力してください。"]);
      return
    }

    self.service.setUrl(environment.apiUrl + constant.API.UPDATE);
    //新規に設定情報を更新する
    self.service.updateSettingInfo(self.settingInfo)
    .subscribe({
      next:(isUpdate:any) => {
        if(isUpdate){
          //更新に成功したら、ダイアログを閉じる
          self.closeDialog("更新");
          self.snackBarService.openSnackBar("更新に成功しました");
        }
      },
      error: (e:any) => {
        self.errorSnackBarService.openSnackBar(e);
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

  //セッティングネイムに値を入力時
  settingNameValueChanges():void{
    let self = this;
    self.settingName.valueChanges.subscribe((v) => {
      if(!v){
        self.settingNameErrorMessage = "セッティングネイムを入力してください。"
      } else if(100 < v.length){
        self.settingNameErrorMessage = "セッティングネイムの最大文字数は100文字です。";
      } else {
        self.settingNameErrorMessage = "";
      }
    })
  }

  /**
   * 
   * @param e Event
   * @param name キー名
   * @returns 
   */
  changeInput(e:any,name:string):void{
    let self = this;
    let num:number = Number(e.target?.value);
    let max:number = Number(e.target?.max);
    let min:number = Number(e.target?.min);

    if(self.isNumber(num)){
      //入力した値が最小値よりも小さい、もしくは最大値よりも大きい場合
      if(self.isValidate(min,max,num)){
        //処理終了
        e.preventDefault();
        return;
      }
      self.settingInfo[name] = num
    } else {
      e.preventDefault();
      return;     
    }
  }

  /**
   * 
   * @param e KeyboardEvent 
   */
  keyDownValidation(e:any,length:number):void{
    let self = this;
    let key:any = e.key;
    let value:string = e.target?.value

    let valueLength = value.length;

    if(key !== "Backspace" && length <= valueLength){
      e.preventDefault();
      return;
    }
  }

  isValidate(min:number,max:number,num:number):boolean{
    return(num < min || max < num);
  }

  /**
   * 値が数字であるか
   * @param value 値
   * @returns 数字であるかの真偽値
   */
  isNumber(value:any):boolean{
    let regex = /^([+-])?([0-9]+)(\.)?([0-9]+)?$/;
    return regex.test(value);
  }
}