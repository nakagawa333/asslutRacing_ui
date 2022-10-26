import { Component,Inject, OnInit,ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SampleDateService} from "src/shared/sampleDate.service";
import {settingModalComponent} from 'src/app/settingModal/settingModal.component';
import {deleteConfirmModalComponent} from 'src/app/deleteConfirmModal/deleteConfirmModal.component'
import {AddSettingInfoModalComponent} from 'src/app/addSettingInfoModal/addSettingInfoModal.component';
import {MatPaginator} from '@angular/material/paginator';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public dialog: MatDialog,public service: SampleDateService,private http: HttpClient) {}

  title:string = 'assltRacing_ui';
  dates:any;
  displayedColumns:string[] = ["title","carName","carse","actions"]
  headers:HttpHeaders = new HttpHeaders();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.toPromise();
  }

  private async toPromise(){
    this.headers.append('Content-Type', 'application/json')
    await this.http.get(constant.API.URL + constant.API.HOME,{
      responseType:"json"
    })
    .subscribe({
      next: (data) => {
        this.dates = this.service.getSamplesDate(data);
        this.dates.paginator = this.paginator;       
      },

      error: (error) => {
        alert(error.statusText)
      }
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
      this.openDialog(AddSettingInfoModalComponent,param)
    })
  }

  //車名一覧,メーカー,コース一覧取得
  private async getInfos():Promise<any>{    
    return await this.http.get(constant.API.URL + constant.API.INFOS,{
      responseType:"json"
    })
    .subscribe((res) => {
      console.log(res)
    })
  }

  //削除ボタンクリック時
  deleteClick(row:any){
    this.deleteConfilmOpenDialog(row,this.dates);
  }

  //ダイアログボタンクリック時
  openDialog(component:any,param:object): void{
    const dialogRef = this.dialog.open(component,param)
  }

  deleteConfilmOpenDialog(row:any,dates:any):void{
    const param:object = {
      data:{"row":row,"dates":dates,"title":row.title,"id":row.id},
      id:"delete-confilm-modal"
    }
    const dialogRef = this.dialog.open(deleteConfirmModalComponent,param)

    dialogRef.afterClosed().subscribe(async(result:any) => {
      dates = this.dates
      const body:object = {"id":result.id}
      if(result.deleteFlag){
        //該当idのデータを削除する
        await this.http.put(constant.API.URL + constant.API.DELETE,body)
        .subscribe(res => {
          if(res == 1){
            dates.data = dates.data.filter((date:any) => {
              return date.id !== result.id;
            })
          }
        })
      }
    })
  }
}