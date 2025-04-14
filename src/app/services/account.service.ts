import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiClientService } from '../shared/api/httpclient';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  constructor(private api:ApiClientService) { 
    
  }

  create(account: any) {
   
     return this.api.post('account',account)
  }

  getAll() {
    return this.api.get<any[]>('account')
  }

  update(account: any) {
    return this.api.put('account', account)
  }

  delete(id: number) {
    return this.api.delete(`account?accountId=${id}`)
  }
  
  getTotalBalance() {
    return this.api.get<number>('account/total-balance');
  }
  
}
