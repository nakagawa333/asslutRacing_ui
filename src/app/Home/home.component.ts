import { Component,Inject, OnInit,ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppService} from "../../app/app.service";
import {settingModalComponent} from 'src/app/settingModal/set-up-modal.component';
import {deleteConfirmModalComponent} from 'src/app/deleteConfirmModal/delete-per-modal.component'
import {AddSettingInfoModalComponent} from 'src/app/addSettingInfoModal/add-set-up-modal.component';
import {MatPaginator} from '@angular/material/paginator';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from "../../constants";
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingInfoTableValue } from '../settingInfoTableValue';
import {MatSort,Sort} from '@angular/material/sort';
import { mixinInitialized } from '@angular/material/core';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    constructor(
      private dialog: MatDialog,
      private service: AppService,
      private http: HttpClient,
      private authService: AuthService
    ) {
    }

    public filterSerachForm = new FormGroup({
      searchName: new FormControl("",[]),
  });

    public title:string = 'assltRacing_ui';

    //テーブル表示用データ
    public dataSource:any;

    //設定情報一覧 (key:タイトル,value:設定情報オブジェクト)
    public settingInfosMap = new Map<String,Object>();

    public displayedColumns:Array<String> = ["title","carName","carse","actions"];

    //列名
    public columnNames:Array<String> = ["セッティングネイム","車名","コース"];

    //選択中の列名
    public selectionColumnName:String = "セッティングネイム";

    //フィルターの選択中の名称
    public filterName:String = "";

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit(): void {
      this.getAllSettingInfo();
    }

    /** 全設定情報を取得する */
    private getAllSettingInfo():void{
      let userId = this.authService.getUserId();

      this.service.setUrl(constant.API.URL + constant.API.HOME);
      let options = {
        "params":{"userId":userId},
        "responseType":"json"
      }

      this.service.getAllSettingInfo(options)
      .subscribe({
          next: (datas:any) => {
            //設定情報
            for(let data of datas){
              this.settingInfosMap.set(data?.title?.trim(),data)
            }

            let settingInfoTableValueList:Array<SettingInfoTableValue> = [];
            for(let data of datas){
               let settingInfoTableValue:SettingInfoTableValue = new SettingInfoTableValue();
               settingInfoTableValue.id = data?.id
               settingInfoTableValue.carName = data?.carName
               settingInfoTableValue.course = data?.course
               settingInfoTableValue.title = data?.title
               settingInfoTableValue.displayFlag = true;
               settingInfoTableValueList.push(settingInfoTableValue)
            }

            this.dataSource = this.service.changeDataToMatTableDataSource(settingInfoTableValueList);
            //paginator
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort
            //フィルター処理
            this.dataSourceFilter(this.filterName);
          },

          error: (error:any) => {
            alert(error?.statusText)
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
      this.http.get(constant.API.URL + constant.API.INFOS,{
        responseType:"json"
      })
      .subscribe((res) => {
        const param:object = {
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
      const param:object = {
        data:{"row":row,"dates":dates,"title":row.title,"id":row.id},
        id:"delete-confilm-modal"
      }
      const dialogRef = this.openDialog(deleteConfirmModalComponent,param)

      let value = this.filterName
      dialogRef.afterClosed().subscribe(async(result:any) => {
        const body:object = {"id":result.id}
        if(result.deleteFlag){
          //該当idのデータを削除する
          this.http.put(constant.API.URL + constant.API.DELETE,body)
          .subscribe((res:any) => {
            //データの削除に成功した場合
            if(res){
              this.getAllSettingInfo();
            }
          })
        }
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