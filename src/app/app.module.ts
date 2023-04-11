/* Copyright 2808
My Company*/


import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
        declarations: [AppComponent],
        imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                BrowserModule,
                IonicModule.forRoot(),
                AppRoutingModule,
        ],
        providers: [
                { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        ],
        bootstrap: [AppComponent],
})
        
/**
 * @description Ng module
 * @author Ranjoy Sen
 */       
export class AppModule {}
