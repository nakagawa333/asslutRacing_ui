import { Dialog } from '@angular/cdk/dialog';
import { Component,Inject, OnInit,ViewChild,AfterViewInit} from '@angular/core';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { animate } from '@angular/animations'
import {SampleDateService} from "src/shared/sampleDate.service";
import { identifierName } from '@angular/compiler';
import {settingModalComponent} from 'src/app/settingModal/settingModal.component';
import {deleteConfirmModalComponent} from 'src/app/deleteConfirmModal/deleteConfirmModal.component'
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit {

  constructor(public dialog: MatDialog,public service: SampleDateService) {}

  title:string = 'assltRacing_ui';
  dates:any;
  displayedColumns:string[] = ["title","carName","carse","actions"]

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.dates = this.service.getSamplesDate();
    console.log(this.paginator)
  }

  ngAfterViewInit() {
    this.dates.paginator = this.paginator;
  }

  //セルをクリックした場合
  cellClick(row:any){
    this.openDialog(row)
  }

  deleteClick(row:any){
    this.deleteConfilmOpenDialog(row,this.dates);
  }

  openDialog(row:any): void{
    const dialogRef = this.dialog.open(settingModalComponent,{
      data:row,
      id:"setting-update-modal"
    })
  }

  deleteConfilmOpenDialog(row:any,dates:any):void{
    const dialogRef = this.dialog.open(deleteConfirmModalComponent,{
      data:{"row":row,"dates":dates,"title":row.title,"id":row.id},
      id:"delete-confilm-modal"
    })

    dialogRef.afterClosed().subscribe((result:any) => {
      //該当idのデータを削除する
      if(result.deleteFlag){
        this.dates.data = this.dates.data.filter((date:any) => {
          return date.id !== result.id;
        })
      }
    })
  }
}