import { Component } from '@angular/core';

export const SnackBarConfig = {
    SnackBarHorizontalPosition:{
        START:"start",
        CENTER:"center",
        END:"end",
        LEFT:"left",
        RIGHT:"right"
    },

    SnackBarVerticalPosition:{
        "TOP":"top",
        "BOTTOM":"bottom"
    },
    duration:3000
} as const;

