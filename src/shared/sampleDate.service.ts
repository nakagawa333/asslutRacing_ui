import { Injectable } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';

import DateFrom from "date.json";

interface Gear{
    final:Number,
    one:Number,
    two:Number,
    three:Number,
    four:Number,
    five:Number
  }
  
interface Camber{
    ago:Number,
    after:Number
}
  
interface Stabiliser{
    ago:Number,
    after:Number
}

interface Dates{
    id: Number,
    title: String,
    carName : String,
    carse : String,
    abs : String,
    powerSteering : Number,
    diffgear : Number,
    tireType : String,
    airPressure : String,
    gear : Gear,
    stabiliser : Stabiliser,
    camber : Camber
    breakPower : Number,
    breakBallance : Number,
    carHigh : String,
    offset : String,
    hoilesize : String,
    describe: String
}

@Injectable({
    providedIn: 'root'
})
export class SampleDateService{
    constructor(){}
    dates : MatTableDataSource<any> = new MatTableDataSource;

    getSamplesDate(dates:any){
        this.dates = new MatTableDataSource(dates);
        return this.dates;
    }
}