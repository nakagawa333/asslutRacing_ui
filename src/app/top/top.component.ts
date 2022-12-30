import { Component,Inject, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as constant from '../../constants';
import { TopService } from './top.component.service';
import { Notifications } from '../interface/notifications';

@Component({
    templateUrl: './top.component.html',
    styleUrls: ['./top.component.css'],
})

export class TopComponent{
    constructor(
        private http: HttpClient,
        private service:TopService
    ){}

    public notifications:Notifications[];

    ngOnInit(){
        this.service.getNotifications()
        .subscribe({
            next:(value:any) => {
                this.notifications = value;
            },
            error:(e:any) => {

            }
        })
    }
}