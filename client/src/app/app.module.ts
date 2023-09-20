import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ErrorHandler,
  NgModule,
  isDevMode,
} from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './helpers/error.interceptor';

import { BrowserModule } from '@angular/platform-browser';
import { environment } from '@environment';
import { DataGrabberInterceptor } from '@helpers/data-grabber.interceptor';
import { ActionsService } from '@services/actions.service';
import { AuthService } from '@services/auth.service';
import { ContentService } from '@services/content.service';
import { MetaService } from '@services/meta.service';
import { RollbarErrorHandler, RollbarService } from '@services/rollbar.service';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { NgxWebstorageModule } from 'ngx-webstorage';
import * as Stores from '../stores';
import * as Migrations from '../stores/migrations';
import { AssetService } from './services/asset.service';
import { SharedModule } from './shared.module';

const allStores = Object.keys(Stores)
  .filter((x) => x.includes('Store'))
  .map((x) => (Stores as Record<string, any>)[x]);

export function getAuthToken() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxTippyModule,
    SharedModule,
    AngularSvgIconModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: getAuthToken,
        allowedDomains: ['localhost:3000', 'api.ateoat.com', 'ateoat.com'],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    NgxsModule.forRoot(allStores, {
      developmentMode: !isDevMode(),
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !isDevMode(),
      filter: (action) =>
        !['GrabData', '[Notifications] Clear Old'].includes(
          action.constructor.name,
        ),
    }),
    NgxsStoragePluginModule.forRoot({
      key: allStores,
      migrations: Object.values(Migrations).flat(),
      storage: StorageOption.LocalStorage,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DataGrabberInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          assetService: AssetService,
          authService: AuthService,
          contentService: ContentService,
          actionsService: ActionsService,
          rollbarService: RollbarService,
          metaService: MetaService,
        ) =>
        async () => {
          const isProduction = environment.production;
          if (!isProduction) {
            document.body.classList.add('dev');
          }

          await assetService.init();
          await contentService.init();
          await authService.init();
          await actionsService.init();
          await rollbarService.init();
          await metaService.init();
        },
      deps: [
        AssetService,
        AuthService,
        ContentService,
        ActionsService,
        RollbarService,
        MetaService,
      ],
      multi: true,
    },
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
