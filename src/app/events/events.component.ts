import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, Directive } from '@angular/core';

import { Observable, fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CombinedCoins, CoinsService } from '../coins.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements AfterViewInit {
  @ViewChildren("coin") coinViewList: QueryList<ElementRef>;
  coins:any[];

  constructor(private coinsService: CoinsService) {}

  readonly events$ : Observable<CombinedCoins[]> = this.coinsService.events$;

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
