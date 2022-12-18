import { Injectable } from "@angular/core";

//通知サービスクラス
@Injectable({
    providedIn: 'root'
})
export class NotificationService{
    public permissionFlag = true;

    public requestPermission():void{
        Notification.requestPermission()
        .then((permission) => {
            if("Notification" in window){
                if (permission == 'granted') {
                    // 許可
                    this.permissionFlag = true;
                } else if (permission == 'denied') {
                    // 拒否
                    this.permissionFlag = false;
                } else if (permission == 'default') {
                    // 無視
                    this.permissionFlag = false;
                }
            }
        });
    }
}