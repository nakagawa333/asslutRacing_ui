import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card'; //カード
import {MatInputModule} from '@angular/material/input'; //input
import {MatTableModule} from '@angular/material/table'; //テーブル
import {MatDialogModule} from '@angular/material/dialog';


const routes: Routes = [];

const MaterialComponents = [
  MatSliderModule,
  MatCardModule,
  MatInputModule,
  MatTableModule,
  MatDialogModule
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MaterialComponents
  ],
  exports: [
    RouterModule,
    MaterialComponents
  ]
})
export class AppRoutingModule { }
