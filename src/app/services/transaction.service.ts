import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiClientService } from '../shared/api/httpclient';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {


  constructor(private api:ApiClientService) { 
    
  }

  create(transaction: any) {
   
     return this.api.post('transaction',transaction)
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
