
import { _isNumberValue } from '@angular/cdk/coercion';
import { Component,Inject, OnInit, ViewChild, ViewChildren,ContentChild	} from '@angular/core';
import { FormControl, FormGroup, Validators,ValidationErrors } from '@angular/forms';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BaseModal } from '../baseModal.component';
import {AddSettingInfoModalService} from "./add-set-up-modal.service"
import * as constant from '../../constants';
import { AuthService } from "../auth.service";
import {SnackBarConfig} from '../union/snabar';
import {MatSnackBar,MatSnackBarConfig,MatSnackBarRef} from '@angular/material/snack-bar';
import { SettingInfo } from '../interface/settingInfo';
import { SnackBarService } from '../snackBar.service';
import { ErrorSnackBarService } from '../errorSnackBar/errorSnackBar.service';
import { SettingInfoMatSliderValue } from '../settingInfoMatSliderValue';


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
      private snackBar:MatSnackBar,
      private errorSnackBarService:ErrorSnackBarService,
      private snackBarService:SnackBarService,
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

  public addSetupForm = new FormGroup({
    settingName: new FormControl("",[
      Validators.required,
      Validators.maxLength(100)
    ]),
    maker: new FormControl("",[
      Validators.required
    ]),
    car: new FormControl("",[
      Validators.required
    ]),
    course: new FormControl("",[
      Validators.required
    ]),
    tireType:new FormControl("",[
      Validators.required
    ])
  })

  //セッティングネイムエラーメッセージ
  public settingNameErrorMessage = "";

  //メーカーエラーメッセージ
  public makerErrorMessage = "";

  //車エラーメッセージ
  public carErrorMessage = "";

  //コースエラーメッセージ
  public courseErrorMessage = "";

  //タイヤの種類エラーメッセージ
  public tireTypeErrorMessage = "";

  //セッティングネイム
  public settingName = this.addSetupForm.controls.settingName;

  //メーカー
  public maker = this.addSetupForm.controls.maker;

  //車
  public car = this.addSetupForm.controls.car;

  //コース
  public course = this.addSetupForm.controls.course;

  //タイヤの種類
  public tireType = this.addSetupForm.controls.tireType;


  //設定情報
  public settingInfo:SettingInfo = Object.assign({},this.service.settingInfo);

  public MatSliderValue = SettingInfoMatSliderValue

  //snackBarを開くための設定値
  private addSetupModalSnackConfig:MatSnackBarConfig<any> = {
    horizontalPosition:SnackBarConfig?.SnackBarHorizontalPosition?.CENTER,
    verticalPosition:SnackBarConfig?.SnackBarVerticalPosition?.TOP,
    // duration:SnackBarConfig?.duration,
    panelClass: ['success-snackbar']
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
    if(userId !== null){
      //ユーザーidを設定
      this.settingInfo["userId"] = Number(userId)
    }

    this.settingNameValueChanges();
  }

  ngAfterViewChecked(){
    let self = this;
  }

  /** メーカー一覧を選択した場合  */
  makerSelectBoxChange(makerId:any){
    let self = this;
    if(self.service.isNumber(makerId)){
      self.carsList = self.carsHashMap.get(Number(makerId));
      self.hasCarList = false;

      if(self.carsList !== null && self.carsList.length !== 0){
        self.defalutCarId = self.carsList[0]["carId"];
        //コースidを設定
        self.settingInfo["carId"] = self.defalutCarId;
      }

      self.makerErrorMessage = "";
      self.carErrorMessage = "";
      //メーカーidを設定
      self.settingInfo["makerId"] = makerId
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
    this.addSettingInfo();
  }

  private addSettingInfo():void{
    let self = this;

    //エラーメッセージを初期化
    self.initSettingErrorMessage();

    if(self.addSetupForm.invalid) {
      let errorMessageList:string[] = [];

      //セッティングネイムが入力されていない場合
      if(self.settingName.invalid){
        self.settingNameErrorMessage = "セッティングネイムを入力してください。";
        errorMessageList.push("・セッティングネイムを入力してください。");
      }

      //車が選択されていなかった場合
      if(self.car.invalid){
        self.carErrorMessage = "車を選択してください。";
        errorMessageList.push("・車を選択してください。");
      }

      //メーカーが選択されていなかった場合
      if(self.maker.invalid){
        self.makerErrorMessage = "メーカーを選択してください。";
        errorMessageList.push("・メーカーを選択してください。");
      }

      //コースが選択されていなかった場合
      if(self.course.invalid){
        self.courseErrorMessage = "コースを選択してください。";
        errorMessageList.push("・コースを選択してください。");
      }

      //タイヤの種類が選択されていない場合
      if(self.tireType.invalid){
        self.tireTypeErrorMessage = "タイヤの種類を選択してください。";
        errorMessageList.push("・タイヤの種類を選択してください。");
      }
      
      //snackBarを開く
      self.errorSnackBarService.openSnackBarForErrorMessage(errorMessageList);
      return;
    }

    self.service.setUrl(constant.API.URL + constant.API.ADD);

    //新規に設定情報を登録する
    self.service.addSettingInfo(self.settingInfo)
    .subscribe({
      next:(addSettingInfoFlag:any) => {
        if(addSettingInfoFlag){
          //登録に成功したら、ダイアログを閉じる
          self.closeDialog("登録");
          //設定情報を初期化
          self.initSettingInfo()
          self.snackBarService.openSnackBar("登録に成功しました");
        }
      },
      error: (e:any) => {
        self.errorSnackBarService.openSnackBar(e);
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
    let self = this

    if(name === "courseId"){
      //コース選択時
      self.courseErrorMessage = "";
    } else if(name === "tireId"){
      //タイヤの種類選択時
      self.tireTypeErrorMessage = "";
    }
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

  //エラーメッセージを初期化
  initSettingErrorMessage():void{
    let self = this;
    self.settingNameErrorMessage = "";
    self.carErrorMessage = "";
    self.makerErrorMessage = "";
    self.courseErrorMessage = "";
    self.tireTypeErrorMessage = "";
  }
}