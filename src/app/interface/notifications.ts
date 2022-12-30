type Nullable<T> = T | undefined | null;

export interface Notifications{
    //タイトル
    title:Nullable<string>,
    //内容
    content:Nullable<string>,
    //作成時間(yyyy/mm/dd)
    createTime:Nullable<string>,
    [key:string]:any
}