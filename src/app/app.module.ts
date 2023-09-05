import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphqlModule } from './graphql/graphql.module';
import { SppinerInterceptor } from './shared/services/sppiner.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    GraphqlModule    
  ], 
  providers: [ 
    {
      provide: HTTP_INTERCEPTORS, useClass: SppinerInterceptor , multi: true
    }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
