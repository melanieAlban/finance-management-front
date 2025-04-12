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
   
     return this.api.post('/account',account)
  }
}
