import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private currentOrder$ = new BehaviorSubject<Order | null>(null);

  setOrder(order: Order): void {
    console.log('ReceiptService: Setting order', order);
    this.currentOrder$.next(order);
  }

  getOrder(): Observable<Order | null> {
    return this.currentOrder$.asObservable();
  }

  getCurrentOrder(): Order | null {
    const order = this.currentOrder$.value;
    console.log('ReceiptService: Getting current order', order);
    return order;
  }

  clearOrder(): void {
    this.currentOrder$.next(null);
  }
}
