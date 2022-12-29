import { settingModalComponent } from "../settingModal/set-up-modal.component";

type Nullable<T> = T | undefined | null;

export interface SettingInfo{
    title:Nullable<string>,
    carId:Nullable<number>,
    makerId:Nullable<number>,
    courseId:Nullable<number>,
    abs:boolean,
    powerSteering:Nullable<number>,
    diffgear:Nullable<number>,
    frontTirePressure:Nullable<number>,
    rearTirePressure:Nullable<number>,
    tireId:Nullable<number>,
    airPressure:Nullable<number>,
    gearFinal:Nullable<number>,
    gearOne:Nullable<number>,
    gearTwo:Nullable<number>,
    gearThree:Nullable<number>,
    gearFour:Nullable<number>,
    gearFive:Nullable<number>,
    stabiliserAgo:Nullable<number>,
    stabiliserAfter:Nullable<number>,
    maxRudderAngle:Nullable<number>,
    ackermannAngle:Nullable<number>,
    camberAgo:Nullable<number>,
    camberAfter:Nullable<number>,
    breakPower:Nullable<number>,
    breakBallance:Nullable<number>,
    carHigh:Nullable<number>,
    offset:Nullable<number>,
    hoilesize:Nullable<number>,
    memo:Nullable<string>,
    userId:Nullable<number>,
    [key: string]: any
}