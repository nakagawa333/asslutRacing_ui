import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import * as constant from '../../constants';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let self = this;
      //ログイン状態であるか
      let isLoggedIn:BehaviorSubject<boolean> = self.authService.isLoggedIn;

      if(!isLoggedIn){
        self.router.navigate([constant.PATH.LOGIN]);
      }

      return isLoggedIn;
  }
}
