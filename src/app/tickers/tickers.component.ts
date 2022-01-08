import { Component, AfterViewInit } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';

import { Ticker, CoinsService } from '../coins.service';


@Component({
  selector: 'app-tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.css']
})

export class TickersComponent implements AfterViewInit {
  constructor(private coinsService: CoinsService) {}

  readonly tickers$: Observable<Ticker[]> = this.coinsService.tickers$;

  tickerApiCoin$: Observable<string>;

  ngAfterViewInit() {
    this.tickerApiCoin$ = this.coinsService.tickerApiCoin
                                            .pipe(
                                              distinctUntilChanged(),
                                              shareReplay({ bufferSize: 1, refCount: true })
                                            );
  }
}
