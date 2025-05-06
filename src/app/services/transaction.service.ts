import { Injectable } from '@angular/core';
import { ApiClientService } from '../shared/api/httpclient';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private transactionsUpdated = new Subject<void>();
  transactionsUpdated$ = this.transactionsUpdated.asObservable();

  constructor(private api: ApiClientService) { }

  create(transaction: any) {
    return this.api.post('transaction', transaction).pipe(
      tap(() => this.transactionsUpdated.next())
    );
  }

  getAll() {
    return this.api.get<any[]>('transaction');
  }

  update(transaction: any) {
    return this.api.put('transaction', transaction).pipe(
      tap(() => this.transactionsUpdated.next())
    );
  }

  delete(id: number) {
    return this.api.delete(`transaction?transactionId=${id}`).pipe(
      tap(() => this.transactionsUpdated.next())
    );
  }
}
