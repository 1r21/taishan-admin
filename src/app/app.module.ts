import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { MeterialModule } from './meterial.module';
import { httpInterceptorProviders } from './http-interceptors';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {
  NewsListComponent,
  NewsDetailDialog,
} from './news-list/news-list.component';

import { ApiService } from './news.service';
import { UserService } from './user.service';
import { LocalStorageService } from './cache/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NewsListComponent,
    NewsDetailDialog,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MeterialModule,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'top',
        duration: 3000,
      },
    },
    LocalStorageService,
    httpInterceptorProviders,
    ApiService,
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
