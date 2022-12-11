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
  //表示フラグ
  private _displayFlag:Boolean;

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

  public get displayFlag(){
    return this._displayFlag;
  }

  public set displayFlag(displayFlag:Boolean){
    this._displayFlag = displayFlag;
  }

}
