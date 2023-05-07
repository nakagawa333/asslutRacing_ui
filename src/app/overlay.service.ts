import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal, ComponentType } from "@angular/cdk/portal";
import { Component, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class OverlayService{
    constructor(
        private overlay: Overlay
    ){
    }

    overlayRef:OverlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: this.overlay
          .position().global().centerHorizontally().centerVertically()
    })

    create():void{
        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            positionStrategy: this.overlay
              .position().global().centerHorizontally().centerVertically()
        })
    }

    attach(component:ComponentType<any>):void{
        this.overlayRef.attach(new ComponentPortal(component));
    }

    show(component:ComponentType<any>):void{
        this.detach();
        //作成
        this.create();
        this.attach(component);
    }

    detach():void{
        this.overlayRef.detach();
    }
}