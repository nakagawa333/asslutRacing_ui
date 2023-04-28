import { Component,ContentChild,Directive,ElementRef,HostListener,Inject, Input, OnInit,QueryList,ViewChild, ViewChildren} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppService} from "../../app/app.service";
import {settingModalComponent} from 'src/app/settingModal/set-up-modal.component';
import {AddSettingInfoModalComponent} from 'src/app/addSettingInfoModal/add-set-up-modal.component';
import {MatPaginator} from '@angular/material/paginator';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../../constants";
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingInfoTableValue } from '../settingInfoTableValue';
import {MatSort,Sort} from '@angular/material/sort';
import { UpdateSettingInfoModalComponent } from '../updateSettingInfoModal/update-setting-info-modal.component';
import { DeleteConfirmModalComponent } from '../deleteConfirmModal/delete-confirm-modal.component';
import { ModalParam } from '../interface/modalParam';
import { SettingInfo } from '../interface/settingInfo';
import { environment } from 'src/environments/environment';
import { HomeService } from './home.service';
import { SnackBarService } from '../snackBar.service';
import { Subject } from 'rxjs/internal/Subject';
import { EventManager } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from '../loadingSpinner/loading-spinner.component';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayService } from '../overlay.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChildren("img") imgs: QueryList<ElementRef>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(LoadingSpinnerComponent) contentChild: LoadingSpinnerComponent;


    constructor(
      private dialog: MatDialog,
      private service: AppService,
      private http: HttpClient,
      private authService: AuthService,
      private snackBarService:SnackBarService,
      private overlayService:OverlayService,
      private homeService:HomeService
    ) {

    }

    public filterSerachForm = new FormGroup({
      searchName: new FormControl("",[])
    });

    public title:string = 'assltRacing_ui';

    //テーブル表示用データ
    public dataSource:any;

    //設定情報一覧 (key:タイトル,value:設定情報オブジェクト)
    public settingInfosMap = new Map<String,SettingInfo>();

    public displayedColumns:Array<String> = ["capture","title","carName","carse","actions"];

    //列名
    public columnNames:Array<String> = [constant.COLUMNNAMES.SETTINGNAME,constant.COLUMNNAMES.CARNAME,constant.COLUMNNAMES.COURSE];

    //選択中の列名
    public selectionColumnName:String = "セッティングネイム";

    //フィルターの選択中の名称
    public filterName:String = "";

    //画像
    public capture:string = constant.COLUMNNAMES.CAPUTURE

    //セッティングネイム
    public settingName:String = constant.COLUMNNAMES.SETTINGNAME;

    //車名
    public carName:String = constant.COLUMNNAMES.CARNAME;

    //コース
    public course:String = constant.COLUMNNAMES.COURSE;

    public pageSizeOptions:number[] = [5,10,15,20]

    //画像 横サイズ
    public imgWidth:number | null = null;

    //画像 縦サイズ
    public imgHeight:number | null = null;

    ngOnInit(): void {
      this.getAllSettingInfo();
    }

    ngAfterContentInit(): void{
      console.log(this.contentChild)
    }
    // @HostListener('window:resize', ['$event'])
    // onResize():void{

    // }

    /** 全設定情報を取得する */
    private getAllSettingInfo():void{
      let self = this;
      let userId = self.authService.getUserId();

      this.service.setUrl(environment.apiUrl + constant.API.HOME);

      this.overlayService.attach(LoadingSpinnerComponent);
      this.service.getAllSettingInfo(userId)
      .subscribe({
          next: (datas:any) => {
            //設定情報
            for(let data of datas){
              this.settingInfosMap.set(data?.title?.trim(),data)
            }

            let settingInfoTableValueList:SettingInfoTableValue[] = [];
            for(let data of datas){
               let settingInfoTableValue:SettingInfoTableValue = new SettingInfoTableValue();
               settingInfoTableValue.id = data?.id
               settingInfoTableValue.carName = data?.carName
               settingInfoTableValue.course = data?.course
               settingInfoTableValue.title = data?.title
               settingInfoTableValue.imgBase64Url = data?.imgBase64Url
               settingInfoTableValueList.push(settingInfoTableValue)
            }

            this.dataSource = this.service.changeDataToMatTableDataSource(settingInfoTableValueList);
            //paginator
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort
            //フィルター処理
            this.dataSourceFilter(this.filterName);
            this.overlayService.detach();  
          },

          error: (error:any) => {
            alert(error?.statusText)
            this.overlayService.detach();
          }
      })
    }

    //フィルターテキストボックスに値を入力した場合
    public filterInput(value:String):void{
      this.filterName = value;
      this.dataSourceFilter(value);

      this.dataSource.paginator = this.paginator;
    }

    //列名セレクタの選択値を変更した場合
    public selectorColumnNameChange(columnName:any):void{
      this.selectionColumnName = columnName;
      //フィルター処理
      this.dataSourceFilter(this.filterName);
    }

    //追加ボタンクリック時
    public addClick():void{
      this.http.get(environment.apiUrl + constant.API.INFOS,{
        responseType:"json"
      })
      .subscribe((res) => {
        const param:ModalParam = {
          data:{"dates":res},
          id:"add-modal",
          width:"90%",
          height:"90%",
          maxWidth:"100%"
        }

        //ダイアログを開く
        const dialogRef = this.openDialog(AddSettingInfoModalComponent,param)

        //ダイアログが閉じられた場合
        dialogRef.afterClosed().subscribe(async(result:any) => {
          if(result === "登録"){
            this.getAllSettingInfo();
          }
        })
      })
    }

    //削除ボタンクリック時
    public deleteClick(row:any){
      this.deleteConfilmOpenDialog(row,this.dataSource);
    }

    //ダイアログボタンクリック時
    private openDialog(component:any,param:object):any{
      return this.dialog.open(component,param)
    }

    private deleteConfilmOpenDialog(row:any,dates:any):void{
      let self = this;

      const param:object = {
        data:{"row":row,"dates":dates,"title":row.title + "を削除してもよろしいでしょうか？","id":row.id},
        id:"delete-confilm-modal"
      }
      const dialogRef = self.openDialog(DeleteConfirmModalComponent,param)

      let value = self.filterName
      dialogRef.afterClosed().subscribe((result:any) => {
        const body:object = {"id":result.id}
        if(result.deleteFlag){
          //該当idのデータを削除する
          self.homeService.deleteSettingInfo(body)
          .subscribe((res:any) => {
            //データの削除に成功した場合
            if(res){
              self.snackBarService.openSnackBar(row.title + "を削除しました");
              //設定情報を再取得する
              self.getAllSettingInfo();
            }
          })
        }
      })
    }

    //更新ボタンクリック時
    public updateClick(row:any){
      //メーカー,車,コースを取得
      this.http.get(environment.apiUrl + constant.API.INFOS,{
        responseType:"json"
      })
      .subscribe((infos) => {
        this.http.get(environment.apiUrl + constant.API.SELECT + row.id,{
          responseType:"json"
        })
        .subscribe((settingInfo) => {
          const param:ModalParam = {
            data:{"infos":infos,"settingInfo":settingInfo},
            id:"update-modal",
            width:"90%",
            height:"90%",
            maxWidth:"100%"
          }

          const dialogRef = this.openDialog(UpdateSettingInfoModalComponent,param)

          //ダイアログが閉じられた場合
          dialogRef.afterClosed().subscribe(async(result:any) => {
            if(result === "更新"){
              this.getAllSettingInfo();
            }
          })
        })
      })
    }

    //テーブル用データフィルター
    public dataSourceFilter(value:String):void{
      this.dataSource.filter = value;
      this.dataSource.filterPredicate=(data:any) => {
        if(!value) return true;
        switch(this.selectionColumnName){
          case "セッティングネイム":
            let title = data.title
            //入力値の長さがセッティングネイムの長さよりも短い場合
            if(value?.length <= title?.length
              && value === title.substring(0,value.length)){
                return true;
              }
              return false;
          case "車名":
            let carName = data.carName
            if(value?.length <= carName?.length
              && value === carName.substring(0,value.length)){
                return true;
            }
            return false;
          case "コース":
            let course = data.course
            if(value?.length <= course?.length
               && value === course.substring(0,value.length)){
                return true;
            }
            return false;
        }
        return true;
      }
    }
}