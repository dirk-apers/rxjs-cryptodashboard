import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common'
import localeNl from '@angular/common/locales/nl';
registerLocaleData(localeNl);

import { CoinsComponent } from './coins/coins.component';
import { TickersComponent } from './tickers/tickers.component';
import { EventsComponent } from './events/events.component';
import { CoinsService } from './coins.service';

@NgModule({
  declarations: [AppComponent, CoinsComponent, TickersComponent, EventsComponent],
  imports: [BrowserModule, HttpClientModule, BrowserModule],
  providers: [{ provide: LOCALE_ID, useValue: 'nl-BE'}, CoinsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
