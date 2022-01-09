import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, ReplaySubject } from 'rxjs';
import {filter, map, shareReplay, tap, distinctUntilChanged, switchMap,      mergeAll, toArray, mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  readonly coinApiUrl: string = "https://api.coinpaprika.com/v1/coins/";
  readonly tickerApiUrl: string = "https://api.coinpaprika.com/v1/tickers/";
  readonly tickerApiParams: string = "?quotes=USD,EUR";

  tickerApiCoin: ReplaySubject<string> = new ReplaySubject<string>();
  fullTickerApiUrl: ReplaySubject<string> = new ReplaySubject<string>();

  constructor(private httpClient: HttpClient) {
    this.init();
  }

  tickers$: Observable<Ticker[]>;

  readonly coins$: Observable<Coin[]> = this.httpClient
    .get<Coin[]>(this.coinApiUrl)
    .pipe(
      filter((allCoins: Coin[]) => allCoins.length > 10),
      map((allCoins: Coin[]) =>
        allCoins.filter(
          (coin: Coin) =>
            !coin.is_new && coin.rank > 0 && coin.rank < 10
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    readonly events$: Observable<CombinedCoins[]> = this.httpClient
      .get<Coin[]>(this.coinApiUrl)
      .pipe(
        map((allCoins: Coin[]) =>
              allCoins.filter(
                (coin: Coin) =>
                  !coin.is_new && coin.rank > 0 && coin.rank < 10
              )
        ),
        mergeAll(),
        mergeMap(coinData =>
          this.httpClient
          .get<Coin[]>(this.coinApiUrl + coinData.id + '/events')
          .pipe(
            map(eventData =>
                  eventData.filter((event: Event) => !event.is_conference)
            ),
            map(eventData => ({coinData, eventData})
           )),
        ),
        toArray()
      );

  init() {
    this.tickers$ = this.fullTickerApiUrl
      .pipe(
        distinctUntilChanged(),
        switchMap(url => this.httpClient.get<TickerData>(url)),
        map((data: any) => data.quotes),
        map((data: any) => Object
                              .keys(data)
                              .map(key => ({currency: key,
                                            price: data[key].price,
                                            volume_24h:data[key].volume_24h,
                                            market_cap: data[key].market_cap}))),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  assignNewTickerCoin(newValue: string) {
    this.tickerApiCoin.next(newValue);
    this.fullTickerApiUrl.next(this.tickerApiUrl + newValue + this.tickerApiParams);
  }
}

export type Coin = Record<string, string | number | boolean>;
export type Event = Record<string, string | number | boolean>;
export type TickerData = Record<string, string | number | boolean>;

export interface Ticker {
  currency: string;
  price: number;
  volume_24h: number;
  market_cap: number;
}

export interface CombinedCoins {
  coinData: Coin;
  eventData: Event[];
}
