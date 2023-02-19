import { HttpErrorResponse } from "@angular/common/http";
import { Injectable,OnInit } from "@angular/core";


@Injectable({
    providedIn: 'root',
})

export class HttpErrorResponseService{
    constructor(

    ){}

    /**
     * エラーレスポンスからエラーメッセージリストを作成する
     * @param e 
     * @returns エラーメッセージリスト
     */
    createErrorMessageList(e:HttpErrorResponse):string[]{
        let errorMessageList:string[] = [];

        let error = e.error

        if(error.errors){

          let errors:any[] = error.errors;

          for(let error of errors){
            errorMessageList.push(error.defaultMessage);
          }
        } else {
          errorMessageList.push(e.error.message);
        }

        return errorMessageList;
    }
}