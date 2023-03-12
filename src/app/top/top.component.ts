import { Component,Inject, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../../constants';
import { TopService } from './top.component.service';
import { Notifications } from '../interface/notifications';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
    templateUrl: './top.component.html',
    styleUrls: ['./top.component.css'],
})

export class TopComponent{
    constructor(
        private http: HttpClient,
        private service:TopService,
        public authService: AuthService,
        private router:Router
    ){}

    public notifications:Notifications[] | null | undefined;

    //key:ページ value:
    private notificationsMap = new Map<number, Notifications[]>();

    public pageSizeOptions:number[] = [5, 10, 15, 20];

    public length:number = 0;

    public pageSize:number = 5;

    public pageIndex:number = 0;

    //ログインしている際は、ログイン画面 していない場合はホーム
    public path = this.authService.isLoggedIn.getValue() ? constant.PATH.HOME : constant.PATH.LOGIN;

    ngOnInit(){
        this.getNotifications()
    }

    //お知らせ通知一覧を取得
    private getNotifications():void{
        this.service.getNotifications()
        .subscribe({
            next:(notifications:any) => {
                //お知らせ一覧のページネーションの設定を行う。
                this.setNotificationsPagenation(notifications);
                if(this.notificationsMap.get(this.pageIndex) !== undefined){
                    this.notifications = this.notificationsMap.get(this.pageIndex)
                }
            },
            error:(e:any) => {

            }
        })
    }

    //お知らせ一覧のページネーションの設定を行う。
    private setNotificationsPagenation(notifications:Notifications[]):void{
        if(notifications !== null && notifications !== undefined){
            let notificationsLength = notifications.length
            //ページ数
            let loopLength = Math.ceil(notificationsLength / this.pageSize);
            //リストの切り取りのスタートインデックス
            let sliceStartIndex = 0;
            let pageSize = this.pageSize;
            for(let i = 0; i < loopLength; i++){
                this.notificationsMap.set(i,notifications.slice(sliceStartIndex,sliceStartIndex+pageSize))
                sliceStartIndex += pageSize
            }
            this.length = notificationsLength;
        }
    }

    public handlePage(e:PageEvent):void{
        if(this.pageSize === e.pageSize){
            this.notifications = this.notificationsMap.get(e.pageIndex)
        } else {
            //ページサイズが変更された場合
            this.pageSize = e.pageSize
            this.getNotifications()
        }
    }

    //「始める」ボタンクリック時
    public startClick():void{
        this.router.navigate([constant.PATH.LOGIN])
    }
}