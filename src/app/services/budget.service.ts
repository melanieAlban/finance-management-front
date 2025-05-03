import { Injectable } from '@angular/core';
import { ApiClientService } from '../shared/api/httpclient';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  
    private budgetUpdated = new BehaviorSubject<void>(undefined);
    transactionsUpdated$ = this.budgetUpdated.asObservable();

  constructor(private api:ApiClientService) { 
      
    }
  
    create(budget: any) {
      return this.api.post('budget', budget).pipe(
        tap(() => this.budgetUpdated.next())  
      );
    }
  
    getAll() {
      return this.api.get<any[]>('budget')
    }
  
      update(budget: any) {
        return this.api.put('budget', budget)
      }
    
    delete(id: number) {
      return this.api.delete(`budget?budgetId=${id}`)
    }
}
