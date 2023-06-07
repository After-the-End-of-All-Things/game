import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { JwtModule } from "@auth0/angular-jwt";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './error.interceptor';

const Migrations: Record<any, any> = {};
const allStores: any[] = [];

export function getAuthToken() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getAuthToken,
        allowedDomains: ["localhost:3000", "ateoat.com"],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgxsModule.forRoot(allStores, {
      developmentMode: !isDevMode()
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !isDevMode(),
      filter: action => !action.constructor.name.includes('Timer')
    }),
    NgxsStoragePluginModule.forRoot({
      key: allStores,
      migrations: Object.values(Migrations).flat(),
      storage: StorageOption.LocalStorage
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
       provide: HTTP_INTERCEPTORS,
       useClass: ErrorInterceptor,
       multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule {}
