
import { _isNumberValue } from '@angular/cdk/coercion';
import { Component,Inject, OnInit} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BaseModal } from '../baseModal.component';
import {AddSettingInfoModalService} from "./add-set-up-modal.service"
import * as constant from '../../constants';
import { AuthService } from "../auth.service";
import {SnackBarConfig} from '../union/snabar';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { SettingInfo } from '../interface/settingInfo';

@Component({
  templateUrl: './add-set-up-modal.component.html',
  styleUrls: ['./add-set-up-modal.component.css']
})
export class AddSettingInfoModalComponent implements OnInit,BaseModal{
  constructor(
      public dialogRef: MatDialogRef<AddSettingInfoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private service:AddSettingInfoModalService,
      private authService:AuthService,
      private snackBar:MatSnackBar
  ){}

  public defalutCarId:number = 0;
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

  //車リスト表示判定
  public hasCarList:boolean = true;

  private carHigh:number = 10;

  //設定情報
  public settingInfo:SettingInfo = Object.assign({},this.service.settingInfo);

  //snackBarを開くための設定値
  private addSetupModalSnackConfig:MatSnackBarConfig<any> = {
    horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
    verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
    duration:SnackBarConfig?.duration
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

    //ユーザーid
    let userId:string = this.authService.getUserId();
    if(userId !== null && userId !== null){
      //ユーザーidを設定
      this.settingInfo["userId"] = Number(userId)
    }
  }

  /** メーカー一覧を選択した場合  */
  makerSelectBoxChange(makerId:any){
    if(this.service.isNumber(makerId)){
      this.carsList = this.carsHashMap.get(Number(makerId));
      this.hasCarList = false;

      if(this.carsList !== null && this.carsList.length !== 0){
        this.defalutCarId = this.carsList[0]["carId"];
        //コースidを設定
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
    this.absText = checked ? "ON" : "OFF";
    //登録用設定情報のabsを変更
    this.settingInfo["abs"] = checked
  }

  /** 登録するボタンをクリックした場合 */
  addSettingClick():void{
    this.addSettingInfo()
  }

  private addSettingInfo():void{
    this.service.setUrl(constant.API.URL + constant.API.ADD);
    //新規に設定情報を登録する
    this.service.addSettingInfo(this.settingInfo)
    .subscribe({
      next:(data:any) => {
        if(data === 1){
          //登録に成功したら、ダイアログを閉じる
          this.closeDialog("登録");
          //設定情報を初期化
          this.initSettingInfo()
          this.snackBar.open("登録に成功しました","",this.addSetupModalSnackConfig);
        }
      },
      error: (e:any) => {
        let errors:any = e["error"]["errors"]
        let errorText:string = "";
        let errorsLength:number = Object.keys(errors).length;
        for(let i = 0; i < errorsLength; i++){
          errorText += errors[i]["field"] + " " + errors[i]["defaultMessage"] + "\n "
        }

        this.snackBar.open(errorText,"",this.addSetupModalSnackConfig);
      }
    })
  }

  //設定情報を初期化
  initSettingInfo():void{
    this.settingInfo = Object.assign({},this.service.settingInfo)
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