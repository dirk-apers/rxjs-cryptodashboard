import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, Directive } from '@angular/core';

import { Observable, fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Coin, CoinsService } from '../coins.service';


@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})

export class CoinsComponent implements AfterViewInit {
  @ViewChildren("coin") coinViewList: QueryList<ElementRef>;
  coins:any[];

  constructor(private coinsService: CoinsService) {}

  readonly coins$: Observable<Coin[]> = this.coinsService.coins$;
  readonly coinsCombined$ : Observable<Coin[]> = this.coinsService.coinsCombined$;

  ngAfterViewInit() {
    this.coinViewList.changes.subscribe(() => this.updateCoins());
  }

  updateCoins() {
    this.coins = this.coinViewList.map((button) => fromEvent<MouseEvent>(button.nativeElement, 'click'));

    this.coins.map((observable) => {
      observable.subscribe((event:MouseEvent) => {
          const element:Element = event.target as Element;
        this.updateTickerCoin(element.parentNode);
      })
    });
  }

  updateTickerCoin(index) {
    this.coinsService.assignNewTickerCoin(index.id);
  }
}
