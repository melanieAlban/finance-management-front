import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiClientService } from '../shared/api/httpclient';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactionsUpdated = new BehaviorSubject<void>(undefined);
  transactionsUpdated$ = this.transactionsUpdated.asObservable();

  constructor(private api:ApiClientService) { 
    
  }

  create(transaction: any) {
    return this.api.post('transaction', transaction).pipe(
      tap(() => this.transactionsUpdated.next())
    );
  }

  getAll() {
    return this.api.get<any[]>('transaction')
  }

  update(transaction: any) {
    return this.api.put('transaction', transaction)
  }

  delete(id: number) {
    return this.api.delete(`transaction?transactionId=${id}`)
  }
  
  
}
