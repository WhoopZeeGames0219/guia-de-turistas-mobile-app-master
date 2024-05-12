import { NgModule, LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { Splash } from './splash/splash.page';
import { CalendarService } from './services/calendar.service'
import { CalendarModule } from 'ion2-calendar';
import { HttpClientModule } from "@angular/common/http";  
import { NgxChartsModule }from '@swimlane/ngx-charts';
import {PortalModule} from '@angular/cdk/portal';
import { Stripe } from '@ionic-native/stripe/ngx';
import { RouterModule } from '@angular/router';
import { PackageMenuModalComponent } from './components/package-menu-modal/package-menu-modal/package-menu-modal.component';
registerLocaleData(localeEsMx, 'es-MX');

@NgModule({
  declarations: [AppComponent, Splash, PackageMenuModalComponent],
  entryComponents: [ Splash ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    NgxQRCodeModule,
    CalendarModule.forRoot({
      doneLabel: 'Buscar',
      closeIcon: true
    }),
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    PortalModule, //BrowserAnimationsModule
    RouterModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CalendarService,
    Stripe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: LOCALE_ID, useValue: 'es-MX' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
