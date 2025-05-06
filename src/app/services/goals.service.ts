import { Injectable } from '@angular/core';
import { ApiClientService } from '../shared/api/httpclient';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {

  constructor(private api:ApiClientService) { }

  getAll() {
    return this.api.get<any[]>('saving/user')
  }
  create(savingGoal: any) {
    return this.api.post('saving', savingGoal);
  }
  update(savingGoal: any) {
    return this.api.put('saving', savingGoal);
  }
  delete(id: number) {
    return this.api.delete(`saving?id=${id}`);
  }

}
