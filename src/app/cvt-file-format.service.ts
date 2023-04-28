import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";


@Injectable({
    providedIn: 'root'
})

/**
 * ファイル形式変換サービス
 */
export class CvtFileFormatService{

  constructor(){

  }
  /**
   * オブジェクトurlを元に画像を生成する
   * @param objectUrl オブジェクトurl
   * @returns 
   */
  public cvtObjUrlToImage(objectUrl:string):Observable<Object>{
    return new Observable((observer) => {
      let img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        observer.next(img);
      }

      img.onerror = () => {
        observer.error('画像生成に失敗しました')
      }

    })
  }
  
  /**
   * img要素からキャンバスを生成する
   * @param img 画像
   * @param width 横幅
   * @param height 高さ
   * @returns 
   */
  public cvtHTMLImageElementCanvas(
    img:HTMLImageElement,
    width:number,
    height:number){

      return new Observable((observer) => {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
    
        let ctx = canvas.getContext("2d");
        if(!ctx){
          observer.error('画像生成に失敗しました')
        }
        
        ctx?.drawImage(img,0,0,width,height);
        observer.next(canvas);
      })
  }
}