import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import { AddSettingInfoModalComponent } from './addSettingInfoModal/add-set-up-modal.component';
import { LoginComponent } from './Login/login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './Home/home.component';
import { CookieService } from 'ngx-cookie-service';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SingupComponent } from './SignUp/signup.component';
import { TokenComponent } from './token/token.component';
import { SendPasswordResetMailComponent } from './sendPasswordResetMail/sendPasswordResetMail.component';
import { UpdatePasswordComponent } from './updatePassword/updatePassword.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import { UpdateSettingInfoModalComponent } from './updateSettingInfoModal/update-setting-info-modal.component';
import { LogoutConfirmModalComponent } from './logoutConfirmModal/logout-confirm-modal.component';
import { TopComponent } from './top/top.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {LayoutModule} from '@angular/cdk/layout';
import { NotFoundErrorComponent } from './notFoundError/not-found-error.component';
import { SettingsAccountComponent } from './settingsAccount/settings-account.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SettingsAccountUserNameComponent } from './settingsAccountUserName/settings-account-username.component';
import { ErrorSnackBarComponent } from './errorSnackBar/errorSnackBar.component';


const routes: Routes  = [
  {path:"home",component:HomeComponent},
  {path:"",component:TopComponent},
  {path:"login",component:LoginComponent},
  {path:"signup",component:SingupComponent},
  {path:"verify",component:TokenComponent},
  {path:"password/reset",component:SendPasswordResetMailComponent},
  {path:"verify/mail",component:UpdatePasswordComponent},
  {path:"settings/account",component:SettingsAccountComponent},
  {path:"settings/account/username",component:SettingsAccountUserNameComponent},
  {path:'**', pathMatch: 'full', component:NotFoundErrorComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    AddSettingInfoModalComponent,
    LoginComponent,
    HomeComponent,
    SingupComponent,
    SendPasswordResetMailComponent,
    UpdatePasswordComponent,
    UpdateSettingInfoModalComponent,
    LogoutConfirmModalComponent,
    TopComponent,
    SettingsAccountComponent,
    SettingsAccountUserNameComponent,
    ErrorSnackBarComponent,
    NotFoundErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatSlideToggleModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSortModule,
    MatBadgeModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatTooltipModule,
    LayoutModule
  ],
  exports:[RouterModule],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
