import { Component,Inject, OnInit,ViewChild,inject} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppService} from "../app/app.service";
import {settingModalComponent} from 'src/app/settingModal/set-up-modal.component';
import {deleteConfirmModalComponent} from 'src/app/deleteConfirmModal/delete-per-modal.component'
import {AddSettingInfoModalComponent} from 'src/app/addSettingInfoModal/add-set-up-modal.component';
import {MatPaginator} from '@angular/material/paginator';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public service: AppService,
    private http: HttpClient
  ) {}

  title:string = 'assltRacing_ui';
  dates:any;
  displayedColumns:string[] = ["title","carName","carse","actions"]
  headers:HttpHeaders = new HttpHeaders();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getAllSettingInfo();
  }

  /** 全設定情報を取得する */
  private async getAllSettingInfo(){
    this.service.setUrl(constant.API.URL + constant.API.HOME);
    await this.service.getAllSettingInfo().then((observe:any) => {
      observe.subscribe({
        next: (data:any) => {
          this.dates = this.service.changeDataToMatTableDataSource(data);
          this.dates.paginator = this.paginator;       
        },
  
        error: (error:any) => {
          alert(error.statusText)
        }
      })
    })
  }

  //追加ボタンクリック時
  async addClick(){
    await this.http.get(constant.API.URL + constant.API.INFOS,{
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
          this.getAllSettingInfo()
        }
      })
    })
  }

  //削除ボタンクリック時
  deleteClick(row:any){
    this.deleteConfilmOpenDialog(row,this.dates);
  }

  //ダイアログボタンクリック時
  openDialog(component:any,param:object):any{
    return this.dialog.open(component,param)
  }

  deleteConfilmOpenDialog(row:any,dates:any):void{
    const param:object = {
      data:{"row":row,"dates":dates,"title":row.title,"id":row.id},
      id:"delete-confilm-modal"
    }
    const dialogRef = this.openDialog(deleteConfirmModalComponent,param)

    dialogRef.afterClosed().subscribe(async(result:any) => {
      const body:object = {"id":result.id}
      if(result.deleteFlag){
        //該当idのデータを削除する
        await this.http.put(constant.API.URL + constant.API.DELETE,body)
        .subscribe(res => {
          //データの削除に成功した場合
          if(res == 1){
            this.getAllSettingInfo();
          }
        })
      }
    })
  }
}