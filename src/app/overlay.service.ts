import { Overlay } from "@angular/cdk/overlay";
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

    overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: this.overlay
          .position().global().centerHorizontally().centerVertically()
    })

    attach(component:ComponentType<any>):void{
        this.overlayRef.attach(new ComponentPortal(component));
    }

    detach():void{
        this.overlayRef.detach();
    }
}