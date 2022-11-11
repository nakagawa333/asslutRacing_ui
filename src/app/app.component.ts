import { Component} from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    //認証されていない場合とログインページでない場合
    if(!this.authService.isLoggedIn.value && location.pathname !== "/login"){
      //ログイン画面に遷移
      this.router.navigate(["/login"])
    }
  }

  //ログアウトアイコンクリック時
  logoutClick(){
    this.authService.logout();
    this.router.navigate(["/login"])
  }
}