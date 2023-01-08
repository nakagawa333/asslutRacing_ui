import { Component,Inject, OnInit,Input} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector:"notFoundError",
    templateUrl: './not-found-error.component.html',
    styleUrls: ['./not-found-error.component.css']
})
export class NotFoundErrorComponent{

    constructor(

    ){
    }

    whoAmI(){
        return "I am a child component!";
    }
}