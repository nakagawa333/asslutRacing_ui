import { Component} from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as constant from "../constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{

  constructor(
    private router: Router,
    public authService: AuthService,
    private lo: Location
  ) {

    let notApplicablePathNames:Set<String> = new Set([constant.PATH.LOGIN,constant.PATH.SIGNUP,constant.PATH.PASSWORDRESET,constant.PATH.VERIFY,constant.PATH.VERIFYMAIL]);

    //ログイン状態を更新
    this.authService.updateIsLoggedIn();

    //ログイン認証されていない場合
    if(!this.authService.isLoggedIn.value && !notApplicablePathNames.has(location.pathname)){
      //ログイン画面に遷移
      this.router.navigate([constant.PATH.LOGIN])
    } else if(this.authService.isLoggedIn.value && notApplicablePathNames.has(location.pathname)){
      //ログイン認証されている場合
      this.router.navigate([constant.PATH.HOME])
    }
  }

  //ログアウトアイコンクリック時
  logoutClick(){
    this.authService.logout();
    this.router.navigate([constant.PATH.LOGIN])
  }
}