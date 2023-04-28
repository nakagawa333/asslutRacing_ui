/** テーブル表示用設定情報 */
export class SettingInfoTableValue{
  //id
  private _id:Number;
  //タイトル
  private _title:String;
  //車名
  private _carName:String;
  //コース
  private _course:String;
  //画像
  private _imgBase64Url:String;

  public get id(){
    return this._id;
  }

  public set id(id:Number){
    this._id = id;
  }

  public get title(){
    return this._title;
  }

  public set title(title:String){
    this._title = title;
  }

  public get carName(){
    return this._carName;
  }

  public set carName(carName:String){
    this._carName = carName;
  }

  public get course(){
    return this._course;
  }

  public set course(course:String){
    this._course = course;
  }

  public get imgBase64Url(){
    return this._imgBase64Url;
  }

  public set imgBase64Url(imgBase64Url:String){
    this._imgBase64Url = imgBase64Url;
  }
}
